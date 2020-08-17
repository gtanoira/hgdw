import { Request, Response } from 'express';
import moment from 'moment';
import XLSX from 'xlsx';

// Models
interface PaymentCommitModel {
  user_id: string;
  event?: string | '';
  timestamp: string | '';
  status?: string | '';
  access_until?: string | '';
  method_name?: string | '';
  source?: string | '';
  payment_type?: string | '';
  duration?: number | 0;
  trial?: number | 0;
  currency?: string | '';
  taxable_amount?: number | 0;
  vat_amount?: number | 0;
  amount?: number | 0;
  discount?: number | 0;
  user_payment_id?: string | '';
};

// Services
import { userCollectionsService } from '../services/user_collections.service';
import { errorLogsService } from '../services/error-logs.service';

class UserCollectionsController {

  
  // Insertar los register históricos en la tabla history_payment_commit
  public async InsertPaymentCommitHistory(req: Request, res: Response): Promise<any> {

    // RegExp para corregir los timestamp
    const regExpTimestamp = /((\d{1,2})\/(\d{1,2})\/(\d{4})) (.*) (AM|am|PM|pm)/gm;

    const workbook = XLSX.readFile(
      'src/public/downloads/history_user_collections.xlsx'
    );

    // Leer todos los registros y convertirlos en un JsonArray [{}]
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const registers: PaymentCommitModel[] = XLSX.utils.sheet_to_json(worksheet);

    /*
      El proceso consiste en generar in INSERT INTO ... VALUES (...) masivo.
      Por lo que se utiliza el INSERT bulk, que consiste en una instrucción INSERT INTO y
      1000 instrucciones VALUES (...).
      De esta forma se acelera enormemente la carga de los históricos.
      Se usa 1000 VALUES, para que el string que se genera con el comando completo del SQL 
      no supere la capacidad máxima que permite el MySql como límite de  una instrucción SQL.
    */
    let insertValues = '';  // sqlCmd para el VALUES()
    let cantReg = 0;  // cantidad de registros adicionados al VALUES()
    // registers.length
    for (let i = 0; i < registers.length; i++) {

      // Ejecutar el comando SQL si llegó a las 1000 iteraciones
      if ( cantReg > 0 && cantReg % 1000 === 0) {
        console.log('*** i:', i);

        // Ejecutar el insert 
        await userCollectionsController.sendPaymentCommitHistoryData(insertValues);

        // Reinicializar
        insertValues = '';
        cantReg = 0;
      };

      try {
        const register = registers[i];
        
        if (register.event === 'payment_commit') {
          const puserId = register.user_id ? register.user_id : 'no user';
          const pevent = register.event ? register.event : 'register';
          // Corregir el timestamp
          let ptimestamp = register.timestamp?.toString();
          if (regExpTimestamp.test(ptimestamp)) {
            ptimestamp = ptimestamp.replace(regExpTimestamp, (...args) => {
              return args[4] +'/'+ args[2].padStart(2, '0') +'/'+ args[3].padStart(2, '0') +' '+ args[5] +' '+ args[6];
            });
          };
          const pstatus = register.status ? register.status : '';
          const pmethodName = register.method_name ? register.method_name : '';
          const psource = register.source ? register.source : '';
          const ppaymentType = register.payment_type ? register.payment_type : '';
          const pduration = register.duration ? register.duration : 0;
          const ptrial = register.trial ? register.trial : 0;
          const pcurrency = register.currency ? register.currency : '';
          const ptaxableAmount = register.taxable_amount ? register.taxable_amount : 0;
          const pvatAmount = register.vat_amount ? register.vat_amount : 0;
          const pamount = register.amount ? register.amount : 0;
          const pdiscount = register.discount ? register.discount : 0;
          const puserPaymentId = register.user_payment_id ? register.user_payment_id : '';
          // Calcular access_until
          const accessUntil = moment(ptimestamp, 'YYYY/MM/DD HH:mm:ss').add(pduration, 'days');
          const paccessUntil = accessUntil.format('YYYY/MM/DD HH:mm:ss');
          
          insertValues += `('${puserId}','${pevent}','${ptimestamp}','${pstatus}','${paccessUntil}','${pmethodName}'`
            + `,'${psource}','${ppaymentType}',${1},${pduration},${ptrial},'${pcurrency}',${ptaxableAmount},${pvatAmount}`
            + `,${pamount},${pdiscount},'${puserPaymentId}'),`;
          cantReg += 1;
        };
      } catch (error) {
        console.log('*** Error reg: ', i);
        console.log(error);
      }
    }

    await userCollectionsController.sendPaymentCommitHistoryData(insertValues);
    console.log('*** FIN PROCESO history_payment_commit ***');
    return res.send('Proceso finalizado').status(200);
  }

  // Insertar los register históricos en la tabla history_rebill
  public async InsertRebillHistory(req: Request, res: Response): Promise<any> {

    // RegExp para corregir los timestamp
    const regExpTimestamp = /((\d{1,2})\/(\d{1,2})\/(\d{4})) (.*) (AM|am|PM|pm)/gm;

    const workbook = XLSX.readFile(
      'src/public/downloads/history_user_collections.xlsx'
    );

    // Leer todos los registros y convertirlos en un JsonArray [{}]
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const registers: PaymentCommitModel[] = XLSX.utils.sheet_to_json(worksheet);

    /*
      El proceso consiste en generar in INSERT INTO ... VALUES (...) masivo.
      Por lo que se utiliza el INSERT bulk, que consiste en una instrucción INSERT INTO y
      1000 instrucciones VALUES (...).
      De esta forma se acelera enormemente la carga de los históricos.
      Se usa 1000 VALUES, para que el string que se genera con el comando completo del SQL 
      no supere la capacidad máxima que permite el MySql como límite de  una instrucción SQL.
    */
    let insertValues = '';  // sqlCmd para el VALUES()
    let cantReg = 0;  // cantidad de registros adicionados al VALUES()
    // registers.length
    for (let i = 0; i < registers.length; i++) {

      // Ejecutar el comando SQL si llegó a las 1000 iteraciones
      if ( cantReg > 0 && cantReg % 1000 === 0) {
        console.log('*** i:', i);

        // Ejecutar el insert 
        await userCollectionsController.sendRebillHistoryData(insertValues);

        // Reinicializar
        insertValues = '';
        cantReg = 0;
      };

      try {
        const register = registers[i];
        
        if (register.event === 'rebill') {
          const puserId = register.user_id ? register.user_id : 'no user';
          const pevent = register.event ? register.event : 'register';
          // Corregir el timestamp
          let ptimestamp = register.timestamp?.toString();
          if (regExpTimestamp.test(ptimestamp)) {
            ptimestamp = ptimestamp.replace(regExpTimestamp, (...args) => {
              return args[4] +'/'+ args[2].padStart(2, '0') +'/'+ args[3].padStart(2, '0') +' '+ args[5] +' '+ args[6];
            });
          };
          const pstatus = register.status ? register.status : '';
          const pmethodName = register.method_name ? register.method_name : '';
          const psource = register.source ? register.source : '';
          const ppaymentType = register.payment_type ? register.payment_type : '';
          const pduration = register.duration ? register.duration : 0;
          const ptrial = register.trial ? register.trial : 0;
          const pcurrency = register.currency ? register.currency : '';
          const ptaxableAmount = register.taxable_amount ? register.taxable_amount : 0;
          const pvatAmount = register.vat_amount ? register.vat_amount : 0;
          const pamount = register.amount ? register.amount : 0;
          const pdiscount = register.discount ? register.discount : 0;
          const puserPaymentId = register.user_payment_id ? register.user_payment_id : '';
          // Calcular access_until
          const accessUntil = moment(ptimestamp, 'YYYY/MM/DD HH:mm:ss').add(pduration, 'days');
          const paccessUntil = accessUntil.format('YYYY/MM/DD HH:mm:ss');
          
          insertValues += `('${puserId}','${pevent}','${ptimestamp}','${pstatus}','${paccessUntil}','${pmethodName}'`
            + `,'${psource}','${ppaymentType}',${pduration},${ptrial},'${pcurrency}',${ptaxableAmount},${pvatAmount}`
            + `,${pamount},${pdiscount},'${puserPaymentId}'),`;
          cantReg += 1;
        };
      } catch (error) {
        console.log('*** Error reg: ', i);
        console.log(error);
      }
    }

    await userCollectionsController.sendRebillHistoryData(insertValues);
    console.log('*** FIN PROCESO history_rebill ***');
    return res.send('Proceso finalizado').status(200);
  }

  // Envía el comando SQL a ejecutarse a la base de datos
  private async sendPaymentCommitHistoryData(valuesCmd: string): Promise<void> {
    if (valuesCmd !== '') {
      // Armar el comando Sql
      const sqlCmd = `INSERT INTO history_payment_commit (user_id, event, timestamp, status, access_until, method_name, source, `
        + `payment_type, is_suscription, duration, trial, currency, taxable_amount, vat_amount, amount, discount, user_payment_id) `
        + `VALUES ${valuesCmd.substring(0, valuesCmd.length - 1)};`;
      return await userCollectionsService.insertPaymentCommitHistory(sqlCmd)
      .then( data => { 
        console.log('Proceso Ok:', data.affectedRows, ' - ', data.message);
        return;
      })
      .catch( err => { 
        // Guardar el error en la base de datos
        console.log('ERROR: ', err); 
        errorLogsService.addError('history_payment_commit', err.toString().substring(1, 4000))
        .then(data => null)
        .catch(err => null);
        return;
      });
    };
    return;
  }

  // Envía el comando SQL a ejecutarse a la base de datos
  private async sendRebillHistoryData(valuesCmd: string): Promise<void> {
    if (valuesCmd !== '') {
      // Armar el comando Sql
      const sqlCmd = `INSERT INTO history_rebill (user_id, event, timestamp, status, access_until, method_name, source, `
        + `rebill_type, duration, trial, currency, taxable_amount, vat_amount, amount, discount, user_payment_id) `
        + `VALUES ${valuesCmd.substring(0, valuesCmd.length - 1)};`;
      return await userCollectionsService.insertRebillHistory(sqlCmd)
      .then( data => { 
        console.log('Proceso Ok:', data.affectedRows, ' - ', data.message);
        return;
      })
      .catch( err => { 
        // Guardar el error en la base de datos
        console.log('ERROR: ', err); 
        errorLogsService.addError('history_rebill', err.toString().substring(1, 4000))
        .then(data => null)
        .catch(err => null);
        return;
      });
    };
    return;
  }

}

export const userCollectionsController = new UserCollectionsController();