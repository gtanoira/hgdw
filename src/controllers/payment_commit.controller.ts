import { Request, Response } from 'express';
import XLSX from 'xlsx';
import moment from 'moment';

// Common
import { getDateFromExcel } from '../common/functions.common';

// Environment
import { STATIC_PATH } from '../settings/environment.settings';

// Models
import { PaymentCommitModel } from '../models/payment_commit.model';

// Services
import { paymentCommitService } from '../services/payment_commit.service';
import { errorLogsService } from '../services/error-logs.service';

class PaymentCommitController {

  private rtn_status = 400; // bad request

  // Insertar los missing records
  public async InsertMissingPyc(req: Request, res: Response): Promise<Response> {

    // Obtengo el nombre del archivo y lo descargo al server
    const filename = await paymentCommitController.saveUploadFile(req)
    .then( data => data )
    .catch( (err) => {
      return res.status(503).send({message: err});
    });

    // Iniciar transacción en la base de datos
    await paymentCommitService.startTransaction();

    // Declarar variables
    let insertValues = '';
    let regsGrabados = 0;  // cantidad de registros guardados en la BDatos

    try {
      // Abrir el archivo excel
      const workbook = XLSX.readFile( `${STATIC_PATH}/uploads/${filename}` );
      // Leer los nombres de los TABS u hojas del excel
      // const nombreHoja = excel.SheetNames; // retorna un array string[]

      // Leer todos los registros y convertirlos en un JsonArray [{}]
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const registers: PaymentCommitModel[] = XLSX.utils.sheet_to_json(worksheet);
      console.log(registers.length);

      /*
        El proceso consiste en generar un INSERT INTO ... VALUES (...) masivo (bulk)
        Por lo que se utiliza el INSERT bulk, que consiste en una instrucción INSERT INTO y
        1000 instrucciones VALUES (...).
        De esta forma se acelera enormemente la carga de los registros.
        Se usa 1000 VALUES, para que el string que se genera con el comando completo del SQL 
        no supere la capacidad máxima que permite el MySql como límite de una instrucción SQL.
      */
      
      for (let i = 0; i < registers.length; i++) {

        // Ejecutar el comando SQL si llegó a las 1000 iteraciones
        if ( i > 0 && i % 1000 === 0) {
          console.log('*** i:', i);

          // Ejecutar el insert 
          await paymentCommitController.sendMissingPyc(insertValues)
          .then(data => { 
            regsGrabados += data ;
          })
          .catch(err => { 
            paymentCommitController.rtn_status = 503; // service unavailable
            throw new Error(`HTG-012(E): SQL error: ${err}`); 
          });

          // Reinicializar
          insertValues = '';
        }

        // Leer un registro
        const register = registers[i];
        // Grabar los campos a salvar
        const paccessUntil = getDateFromExcel(register.accessUntil ? +register.accessUntil : 0).toISOString();
        const ptimestamp = getDateFromExcel(register.timestamp ? +register.timestamp : 0).toISOString();
        // Validar campos
        if ('online,offline'.indexOf(register.paymentType) < 0 ) {
          paymentCommitController.rtn_status = 400;
          throw new Error(`HTG-011(E): validando la fila ${i+2} del excel: paymentType es incorrecto`);
        }
        // Grabar los campos opcionales
        const pmessage = register.message ? register.message : '';
        const puserAgent = register.userAgent ? register.userAgent : '';
        const ppaymentId = register.paymentId ? register.paymentId : '';
        const ppackage = register.package ? register.package : '';
        const ptrialDuration = register.trialDuration ? register.trialDuration : 0;
        // Crear el VALUES del INSERT
        insertValues += `('${register.userId}','${register.status}','${paccessUntil}','${register.methodName}'` +
          `,'${register.source}',${register.amount},'${register.paymentType}',${register.duration},'${pmessage}'` +
          `,'${register.event}','${ptimestamp}','${puserAgent}',${register.discount},'${ppaymentId}'` +
          `,${register.isSuscription},'${ppackage}',${register.trial},${ptrialDuration}),`;

        // Chequear que existan todos los campos
        if (insertValues.indexOf('undefined') > 0) {
          paymentCommitController.rtn_status = 400;
          throw new Error(`HTG-011(E): validando la fila ${i+2} del excel: faltan 1 o más campos.`);
        }
      }
    } catch (err) {
      console.log();
      console.log('*** ERROR:');
      console.log(err);
      // Corregir rtn_status si es que viene mal
      paymentCommitController.rtn_status = paymentCommitController.rtn_status === 200 ? 503 : paymentCommitController.rtn_status;
      await paymentCommitService.rollbackTransaction();  // Rollback toda la transaccion
      await paymentCommitService.endTransaction(); // finalizar la transacción      
      return res.status(paymentCommitController.rtn_status).send({message: err.toString().replace(/Error: /g, '')});
    }

    // Mensaje de retorno
    paymentCommitController.rtn_status = 200;  //ok
    let rtn_message = {message:`${regsGrabados} registro/s grabados`};

    // Procesar los últimos titulos
    if (insertValues === '') {
      paymentCommitService.commitTransaction();  // Commit toda la transaccion

    } else {

      // Grabar los últimos titulos
      await paymentCommitController.sendMissingPyc(insertValues)
      .then((data) => {
        regsGrabados += data;
        rtn_message = {message:`${regsGrabados} registro/s grabados`};
        paymentCommitService.commitTransaction();  // Commit toda la transaccion
      })
      .catch(err => {
        paymentCommitService.rollbackTransaction();  // Rollback toda la transaccion
        paymentCommitController.rtn_status = 503;  // service unavailable
        rtn_message = {message: `HTG-012(E): SQL error: ${err}`};
      });
    }

    // Liberar la transacción
    paymentCommitService.endTransaction();

    // Guardar la operación en Error_logs
    errorLogsService.addError('missing_payment_commit', rtn_message.message, 'nocode', 0);
    
    // Retornar el resultado
    console.log('*** FIN:', paymentCommitController.rtn_status, rtn_message);
    return res.status(paymentCommitController.rtn_status).send(rtn_message);
  }

  // Envía el comando SQL a ejecutarse a la base de datos
  private async sendMissingPyc(valuesCmd: string): Promise<number> {
    if (valuesCmd !== '') {
      // Armar el comando Sql
      const sqlCmd = `INSERT INTO Datalake.payment_commit (user_id, status, access_until, method_name, source, amount, payment_type` +
        `,duration, message, event, timestamp, user_agent, discount, payment_id, is_suscription, package, trial, trial_duration)` + 
        ` VALUES ${valuesCmd.substring(0, valuesCmd.length - 1)};`;
      return await paymentCommitService.insertMissingPyc(sqlCmd)
      .then( data => { 
        console.log('Proceso Ok:', data.affectedRows, ' - ', data.message);
        return data.affectedRows;
      })
      .catch( err => { 
        // Guardar el error en la base de datos
        errorLogsService.addError('missing_payment_commit', err.toString().substring(0, 4000), 'nocode', 0)
        .then(() => null)
        .catch(() => null);

        return Promise.reject(err);
      });
    }
    return 0;
  }

  // Salvar el upload file en el server
  public async saveUploadFile(req: Request): Promise<string | void> {

    // Verificar que se haya enviado un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
      return Promise.reject('HTG-013(E): file upload (no se recibió ningún archivo)');
    }
    
    // Obtener el object que contiene los datos del uploadFile
    const fileUpload =req.files.uploadPyc;

    // Salvar el archivo en UPLOADS
    const filename = `pyc_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
    return await fileUpload.mv(`${STATIC_PATH}/uploads/${filename}`)
    .then( () =>  filename )
    .catch( (err) => Promise.reject(err) );
  }

}

export const paymentCommitController = new PaymentCommitController();