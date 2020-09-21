import { Request, Response } from 'express';
import XLSX from 'xlsx';
import moment from 'moment';

// Common
import { getDateFromExcel } from '../common/functions.common';

// Environment
import { STATIC_PATH } from '../settings/environment.settings';

// Models
interface RegisterModel {
  userId: string;
  event?: string | '';
  source?: string | '';
  name?: string | '';
  lastname?: string | '';
  email?: string | '';
  country?: string | '';
  idp?: string | '';
  timestamp?: string | '';
}

interface DupRegisterModel {
  userId: string;
  cantidad: number;
}

// Services
import { registerService } from '../services/register.service';
import { errorLogsService } from '../services/error-logs.service';

class RegisterController {

  private rtn_status = 400; // bad request

  // Borrar los registros de usuarios duplicados, dejando 1 solo registro para el usuario
  public async delDuplicateRegister(req: Request, res: Response) {

    const workbook = XLSX.readFile(
      'src/public/downloads/duplicate_registers.xlsx'
    );

    // Parsear todos los registros y convertirlos en un JsonArray [{}]
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const dupRegisters: DupRegisterModel[] = XLSX.utils.sheet_to_json(worksheet);

    // Borrar los registros duplicados
    let cantOk = 0;  // cantidad de registros eliminados
    for (let i = 0; i < dupRegisters.length; i++) {
      await registerService.deleteDuplicates(dupRegisters[i].userId, dupRegisters[i].cantidad)
      .then( () => { cantOk += 1; })
      .catch(err => err);
      console.log('Register: ', i);
    }
    return res.send(`Proceso finalizado. Registers procesados: ${dupRegisters.length}. Registers eliminados: ${cantOk}`).status(200);
    
  }

  // Insertar los register históricos en la tabla history_register
  public async InsertHistory(req: Request, res: Response): Promise<Response> {

    // RegExp para validar emails
    const regExpEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    // RegExp para separar name y lastname
    const regExpFullname = /(.*),(.*)/gm;
    // RegExp para corregir los timestamp
    const regExpTimestamp = /((\d{1,2})\/(\d{1,2})\/(\d{4})) (.*) (AM|am|PM|pm)/gm;

    // Abrir el archivo excel
    const workbook = XLSX.readFile( `${STATIC_PATH}/uploads/history_register.xlsx` );
    // Leer los nombres de los TABS u hojas del excel
    // const nombreHoja = excel.SheetNames; // retorna un array string[]

    // Leer todos los registros y convertirlos en un JsonArray [{}]
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const registers: RegisterModel[] = XLSX.utils.sheet_to_json(worksheet);
    console.log(registers.length);

    /*
      El proceso consiste en generar un INSERT INTO ... VALUES (...) masivo (bulk)
      Por lo que se utiliza el INSERT bulk, que consiste en una instrucción INSERT INTO y
      1000 instrucciones VALUES (...).
      De esta forma se acelera enormemente la carga de los históricos.
      Se usa 1000 VALUES, para que el string que se genera con el comando completo del SQL 
      no supere la capacidad máxima que permite el MySql como límite de una instrucción SQL.
    */
    let insertValues = '';
    // registers.length
    for (let i = 0; i < registers.length; i++) {

      // Ejecutar el comando SQL si llegó a las 1000 iteraciones
      if ( i > 0 && i % 1000 === 0) {
        console.log('*** i:', i);

        // Ejecutar el insert 
        await registerController.sendHistoryData(insertValues);

        // Reinicializar
        insertValues = '';
      }

      try {
        const register = registers[i];
        const puserId = register.userId ? register.userId : 'no user';
        const pevent = register.event ? register.event : 'register';
        const psource = register.source ? register.source : 'ma';
        const pname = (register.lastname ? register.lastname.replace(regExpFullname, '$2').replace(/'/g, '').trim() : '');
        const plastname = (register.lastname ? register.lastname.replace(regExpFullname, '$1').replace(/'/g, '').trim() : '');
        const pemail = (register.email && regExpEmail.test(register.email) ? register.email.replace(/'/g, '') : '');
        const pcountry = register.country ? register.country : '';
        // Corregir la fecha
        let ptimestamp = register.timestamp ? register.timestamp : '';
        if (regExpTimestamp.test(ptimestamp)) {
          ptimestamp = ptimestamp.replace(regExpTimestamp, (...args) => {
            return args[4] +'/'+ args[2].padStart(2, '0') +'/'+ args[3].padStart(2, '0') +' '+ args[5] +' '+ args[6];
          });
        }
        const pidp = register.idp ? register.idp : '';
        insertValues += `('${puserId}','${pevent}','${psource}','${pname}','${plastname}','${pemail}','${pcountry}','${ptimestamp}','${pidp}'),`;
      } catch (error) {
        console.log('*** Error reg: ', i);
        console.log(error);
      }
    }

    await registerController.sendHistoryData(insertValues);
    console.log('*** FIN PROCESO history_register ***');
    return res.send('Proceso finalizado').status(200);
  }

  // Envía el comando SQL a ejecutarse a la base de datos
  private async sendHistoryData(valuesCmd: string): Promise<void> {
    if (valuesCmd !== '') {
      // Armar el comando Sql
      const sqlCmd = `INSERT INTO history_register (user_id, event, source, name, lastname, email, country, timestamp, idp) VALUES ${valuesCmd.substring(0, valuesCmd.length - 1)};`;
      return await registerService.insertRegisterHistory(sqlCmd)
      .then( data => { 
        console.log('Proceso Ok:', data.affectedRows, ' - ', data.message);
        return;
      })
      .catch( err => { 
        // Guardar el error en la base de datos
        console.log('ERROR: ', err); 
        errorLogsService.addError('history_register', err.substring(1, 4000), 'nocode', 0)
        .then(() => null)
        .catch(() => null);
        return;
      });
    }
    return;
  }

  // Insertar los register históricos en la tabla history_register
  public async InsertMissingRegister(req: Request, res: Response): Promise<Response> {

    // RegExp para validar emails
    const regExpEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    // RegExp para separar name y lastname
    const regExpFullname = /(.*),(.*)/gm;
    // RegExp para corregir los timestamp
    // const regExpTimestamp = /((\d{1,2})\/(\d{1,2})\/(\d{4})) (.*) (AM|am|PM|pm)/gm;

    // Obtengo el nombre del archivo y lo descargo al server
    const filename = await registerController.saveUploadFile(req)
    .then( data => data )
    .catch( (err) => {
      return res.status(503).send({message: err});
    });

    // Iniciar transacción en la base de datos
    await registerService.startTransaction();

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
      const registers: RegisterModel[] = XLSX.utils.sheet_to_json(worksheet);
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
          await registerController.sendMissingRegister(insertValues)
          .then(data => { 
            regsGrabados += data ;
          })
          .catch(err => { 
            registerController.rtn_status = 503; // service unavailable
            throw new Error(`HTG-012(E): SQL error: ${err}`); 
          });

          // Reinicializar
          insertValues = '';
        }

        try {
          const register = registers[i];
          const puserId = register.userId ? register.userId : 'no user';
          const pevent = register.event ? register.event : 'register';
          const psource = register.source ? register.source : 'ma';
          const pname = (register.lastname ? register.lastname.replace(regExpFullname, '$2').replace(/'/g, '').trim() : '');
          const plastname = (register.lastname ? register.lastname.replace(regExpFullname, '$1').replace(/'/g, '').trim() : '');
          const pemail = (register.email && regExpEmail.test(register.email) ? register.email.replace(/'/g, '') : '');
          const pcountry = register.country ? register.country : '';
          // Corregir la fecha
          const ptimestamp = getDateFromExcel(register.timestamp ? +register.timestamp : 0).toISOString();
          const pidp = register.idp ? register.idp : '';
          insertValues += `('${puserId}','${pevent}','${psource}','${pname}','${plastname}','${pemail}','${pcountry}','${ptimestamp}','${pidp}'),`;
        } catch (error) {
          console.log('*** Error reg: ', i);
          console.log(error);
        }
        
        // Chequear que existan todos los campos
        if (insertValues.indexOf('undefined') > 0) {
          throw new Error(`HTG-011(E): validando la fila ${i} del excel: faltan 1 o más campos.`);
        }
      }
    } catch (err) {
      console.log();
      console.log('*** ERROR:');
      console.log(err);
      await registerService.rollbackTransaction();  // Rollback toda la transaccion
      await registerService.endTransaction(); // finalizar la transacción      
      return res.status(registerController.rtn_status).send({message: err.toString().replace(/Error: /g, '')});
    }

    // Mensaje de retorno
    registerController.rtn_status = 200;  //ok
    let rtn_message = {message:`${regsGrabados} registro/s grabados`};

    // Procesar los últimos titulos
    if (insertValues === '') {
      registerService.commitTransaction();  // Commit toda la transaccion

    } else {

      // Grabar los últimos titulos
      await registerController.sendMissingRegister(insertValues)
      .then((data) => {
        regsGrabados += data;
        rtn_message = {message:`${regsGrabados} registro/s grabados`};
        registerService.commitTransaction();  // Commit toda la transaccion
      })
      .catch(err => {
        registerService.rollbackTransaction();  // Rollback toda la transaccion
        registerController.rtn_status = 503;  // service unavailable
        rtn_message = {message: `HTG-012(E): SQL error: ${err}`};
      });
    }

    // Liberar la transacción
    registerService.endTransaction();

    // Guardar la operación en Error_logs
    errorLogsService.addError('missing_register', rtn_message.message, 'nocode', 0);
    
    // Retornar el resultado
    console.log('*** FIN:', registerController.rtn_status, rtn_message);
    return res.status(registerController.rtn_status).send(rtn_message);
  }

  // Envía el comando SQL a ejecutarse a la base de datos
  private async sendMissingRegister(valuesCmd: string): Promise<number> {
    if (valuesCmd !== '') {
      // Armar el comando Sql
      const sqlCmd = `INSERT INTO Datalake.register (user_id, event, source, name, lastname, email, country, timestamp, idp) VALUES ${valuesCmd.substring(0, valuesCmd.length - 1)};`;
      return await registerService.insertMissingRegister(sqlCmd)
      .then( data => { 
        console.log('Proceso Ok:', data.affectedRows, ' - ', data.message);
        return data.affectedRows;
      })
      .catch( err => { 
        // Guardar el error en la base de datos
        errorLogsService.addError('missing_register', err.toString().substring(0, 4000), 'nocode', 0)
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
    const fileUpload =req.files.uploadRegister;

    // Salvar el archivo en UPLOADS
    const filename = `register_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
    return await fileUpload.mv(`${STATIC_PATH}/uploads/${filename}`)
    .then( () =>  filename )
    .catch( (err) => Promise.reject(err) );
  }

}

export const registerController = new RegisterController();