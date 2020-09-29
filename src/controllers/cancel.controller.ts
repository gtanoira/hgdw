import { Request, Response } from 'express';
import moment from 'moment';
import XLSX from 'xlsx';

// Common
import { getDateFromExcel } from '../common/functions.common';

// Environment
import { STATIC_PATH } from '../settings/environment.settings';

// Models
interface Cancel {
  user_id: string;
  timestamp: string | '';
  event?: string | '';
  source?: string | '';
  channel ?: string | '';
  access_until?: string | '';
}
import { CancelModel } from '../models/cancel.model';

// Services
import { cancelService } from '../services/cancel.service';
import { errorLogsService } from '../services/error-logs.service';

class CancelController {

  // Definir variables
  private rtn_status = 400;

  /*
    HISTORY records
  */
  // Insertar los cancel históricos en la tabla history_rebill
  public async InsertCancelHistory(req: Request, res: Response): Promise<Response> {

    // RegExp para corregir los timestamp
    const regExpTimestamp = /((\d{1,2})\/(\d{1,2})\/(\d{4})) (.*) (AM|am|PM|pm)/gm;

    const workbook = XLSX.readFile(
      'src/public/downloads/history_cancel.xlsx'
    );

    // Leer todos los registros y convertirlos en un JsonArray [{}]
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const registers: Cancel[] = XLSX.utils.sheet_to_json(worksheet);

    /*
      El proceso consiste en generar in INSERT INTO ... VALUES (...) masivo.
      Por lo que se utiliza el INSERT bulk, que consiste en una instrucción INSERT INTO y
      1000 instrucciones VALUES (...).
      De esta forma se acelera enormemente la carga de los históricos.
      Se usa 1000 VALUES, para que el string que se genera con el comando completo del SQL 
      no supere la capacidad máxima que permite el MySql como límite de  una instrucción SQL.
    */
    let insertValues = '';  // sqlCmd para el VALUES()
    // registers.length
    for (let i = 0; i < registers.length; i++) {

      // Ejecutar el comando SQL si llegó a las 1000 iteraciones
      if ( i > 0 && i % 1000 === 0) {
        console.log('*** i:', i);

        // Ejecutar el insert 
        await cancelController.sendCancelHistoryData(insertValues);

        // Reinicializar
        insertValues = '';
      }

      try {
        const register = registers[i];
        
        const puserId = register.user_id ? register.user_id : 'no user';
        // Corregir el timestamp
        let ptimestamp = register.timestamp?.toString();
        if (regExpTimestamp.test(ptimestamp)) {
          ptimestamp = ptimestamp.replace(regExpTimestamp, (...args) => {
            return args[4] +'/'+ args[2].padStart(2, '0') +'/'+ args[3].padStart(2, '0') +' '+ args[5] +' '+ args[6];
          });
        }
        const pevent = register.event ? register.event : 'cancel';
        const psource = register.source ? register.source : '';
        const pchannel = register.channel ? register.channel : '';
                
        insertValues += `('${puserId}','${ptimestamp}','${pevent}','${psource}','${pchannel}'),`

      } catch (error) {
        console.log('*** Error reg: ', i);
        console.log(error);
      }
    }

    await cancelController.sendCancelHistoryData(insertValues);
    console.log('*** FIN PROCESO history_cancel ***');
    return res.send('Proceso finalizado').status(200);
  }

  // Envía el comando SQL a ejecutarse a la base de datos
  private async sendCancelHistoryData(valuesCmd: string): Promise<void> {
    if (valuesCmd !== '') {
      // Armar el comando Sql
      const sqlCmd = `INSERT INTO history_cancel (user_id, timestamp, event, source, channel) `
        + `VALUES ${valuesCmd.substring(0, valuesCmd.length - 1)};`;
      return await cancelService.insertCancelHistory(sqlCmd)
      .then( data => { 
        console.log('Proceso Ok:', data.affectedRows, ' - ', data.message);
        return;
      })
      .catch( err => { 
        // Guardar el error en la base de datos
        console.log('ERROR: ', err); 
        errorLogsService.addError('history_cancel', err.toString().substring(1, 4000), 'nocode', 0)
        .then(() => null)
        .catch(() => null);
        return;
      });
    }
    return;
  }

  /*
    MISSING records
  */
  // Insertar los register históricos en la tabla history_register
  public async InsertMissingCancel(req: Request, res: Response): Promise<Response> {

    // Obtengo el nombre del archivo y lo descargo al server
    const filename = await cancelController.saveUploadFile(req)
    .then( data => data )
    .catch( (err) => {
      return res.status(503).send({message: err});
    });

    // Iniciar transacción en la base de datos
    await cancelService.startTransaction();

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
      const registers: CancelModel[] = XLSX.utils.sheet_to_json(worksheet);
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
          await cancelController.sendMissingCancel(insertValues)
          .then(data => { 
            regsGrabados += data ;
          })
          .catch(err => { 
            cancelController.rtn_status = 503; // service unavailable
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
        // Grabar los campos opcionales
        const puserAgent = register.userAgent ? register.userAgent : '';
        // Crear el VALUES del INSERT
        insertValues += `('${register.userId}','${register.source}','${register.event}','${register.channel}'` +
          `,'${ptimestamp}','${paccessUntil}','${puserAgent}'),`;

        // Chequear que existan todos los campos
        if (insertValues.indexOf('undefined') > 0) {
          cancelController.rtn_status = 400;
          throw new Error(`HTG-014(E): validando la fila ${i+2} del excel: faltan 1 o más campos.`);
        }
      }
    } catch (err) {
      console.log();
      console.log('*** ERROR:');
      console.log(err);
      // Corregir rtn_status si es que viene mal
      cancelController.rtn_status = cancelController.rtn_status === 200 ? 503 : cancelController.rtn_status;
      await cancelService.rollbackTransaction();  // Rollback toda la transaccion
      await cancelService.endTransaction(); // finalizar la transacción      
      return res.status(cancelController.rtn_status).send({message: `HTG-015(E): ${err.toString().replace(/Error: /g, '')}`});
    }

    // Mensaje de retorno
    cancelController.rtn_status = 200;  //ok
    let rtn_message = {message:`${regsGrabados} registro/s grabados`};

    // Procesar los últimos titulos
    if (insertValues === '') {
      cancelService.commitTransaction();  // Commit toda la transaccion

    } else {

      // Grabar los últimos titulos
      await cancelController.sendMissingCancel(insertValues)
      .then((data) => {
        regsGrabados += data;
        rtn_message = {message:`${regsGrabados} registro/s grabados`};
        cancelService.commitTransaction();  // Commit toda la transaccion
      })
      .catch(err => {
        cancelService.rollbackTransaction();  // Rollback toda la transaccion
        cancelController.rtn_status = 503;  // service unavailable
        rtn_message = {message: `HTG-012(E): SQL error: ${err}`};
      });
    }

    // Liberar la transacción
    cancelService.endTransaction();

    // Guardar la operación en Error_logs
    errorLogsService.addError('missing_cancel', rtn_message.message, 'nocode', 0);
    
    // Retornar el resultado
    console.log('*** FIN:', cancelController.rtn_status, rtn_message);
    return res.status(cancelController.rtn_status).send(rtn_message);
  }

  // Envía el comando SQL a ejecutarse a la base de datos
  private async sendMissingCancel(valuesCmd: string): Promise<number> {
    if (valuesCmd !== '') {
      // Armar el comando Sql
      const sqlCmd = `INSERT INTO Datalake.cancel (user_id, source, event, channel, timestamp, access_until, user_agent)` +
        ` VALUES ${valuesCmd.substring(0, valuesCmd.length - 1)};`;
      return await cancelService.insertMissingCancel(sqlCmd)
      .then( data => { 
        console.log('Proceso Ok:', data.affectedRows, ' - ', data.message);
        return data.affectedRows;
      })
      .catch( err => { 
        // Guardar el error en la base de datos
        errorLogsService.addError('missing_cancel', err.toString().substring(0, 4000), 'nocode', 0)
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
    const fileUpload =req.files.uploadCancel;

    // Salvar el archivo en UPLOADS
    const filename = `cancel_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
    return await fileUpload.mv(`${STATIC_PATH}/uploads/${filename}`)
    .then( () =>  filename )
    .catch( (err) => Promise.reject(err) );
  }
}

export const cancelController = new CancelController();