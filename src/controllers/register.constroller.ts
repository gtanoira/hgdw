import e, { Request, Response } from 'express';
import XLSX from 'xlsx';

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
};

interface DupRegisterModel {
  userId: string;
  cantidad: number;
};

// Services
import { registerService } from '../services/register.service';
import { errorLogsService } from '../services/error-logs.service';

class RegisterController {

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
      .then( data => { cantOk += 1; })
      .catch(err => err);
      console.log('Register: ', i);
    };
    return res.send(`Proceso finalizado. Registers procesados: ${dupRegisters.length}. Registers eliminados: ${cantOk}`).status(200);
    
  }

  // Insertar los register históricos en la tabla history_register
  public async InsertHistory(req: Request, res: Response): Promise<any> {

    // RegExp para validar emails
    const regExpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    // RegExp para separar name y lastname
    const regExpFullname = /(.*),(.*)/gm;
    // RegExp para corregir los timestamp
    const regExpTimestamp = /((\d{1,2})\/(\d{1,2})\/(\d{4})) (.*) (AM|am|PM|pm)/gm;

    const workbook = XLSX.readFile(
      'src/public/downloads/history_register.xlsx'
    );
    // Leer los nombres de los TABS u hojas del excel
    // const nombreHoja = excel.SheetNames; // retorna un array string[]

    // Leer todos los registros y convertirlos en un JsonArray [{}]
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const registers: RegisterModel[] = XLSX.utils.sheet_to_json(worksheet);
    console.log(registers.length);

    /*
      El proceso consiste en generar in INSERT INTO ... VALUES (...) masivo.
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
      };

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
        };
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
        errorLogsService.addError('history_register', err.substring(1, 4000))
        .then(data => null)
        .catch(err => null);
        return;
      });
    };
    return;
  }

}

export const registerController = new RegisterController();