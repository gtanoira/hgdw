import { Request, Response } from 'express';
import moment from 'moment';
import XLSX from 'xlsx';

// Models
interface CancelModel {
  user_id: string;
  timestamp: string | '';
  event?: string | '';
  source?: string | '';
  channel ?: string | '';
  access_until?: string | '';
};

// Services
import { cancelService } from '../services/cancel.service';
import { errorLogsService } from '../services/error-logs.service';

class CancelController {

  // Insertar los register históricos en la tabla history_rebill
  public async InsertCancelHistory(req: Request, res: Response): Promise<any> {

    // RegExp para corregir los timestamp
    const regExpTimestamp = /((\d{1,2})\/(\d{1,2})\/(\d{4})) (.*) (AM|am|PM|pm)/gm;

    const workbook = XLSX.readFile(
      'src/public/downloads/history_cancel.xlsx'
    );

    // Leer todos los registros y convertirlos en un JsonArray [{}]
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const registers: CancelModel[] = XLSX.utils.sheet_to_json(worksheet);

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
      };

      try {
        const register = registers[i];
        
        const puserId = register.user_id ? register.user_id : 'no user';
        // Corregir el timestamp
        let ptimestamp = register.timestamp?.toString();
        if (regExpTimestamp.test(ptimestamp)) {
          ptimestamp = ptimestamp.replace(regExpTimestamp, (...args) => {
            return args[4] +'/'+ args[2].padStart(2, '0') +'/'+ args[3].padStart(2, '0') +' '+ args[5] +' '+ args[6];
          });
        };
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
        .then(data => null)
        .catch(err => null);
        return;
      });
    };
    return;
  }

}

export const cancelController = new CancelController();