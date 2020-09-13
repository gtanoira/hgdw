import { getConnection } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models

// Services
import { errorLogsService } from './error-logs.service';

export class RegisterService {

  // Ejecutar in INSERT INTO bulk sobre la tabla history_register
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async insertRegisterHistory(sqlCmd: string): Promise<any> {
    const connection = getConnection(AWS_DBASE);
    return await connection.query(sqlCmd);
  }

  // Eliminar los register duplicados en Datalake.register
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async deleteDuplicates(userId: string, cantidad: number): Promise<any> {
    const sqlCmd = `DELETE FROM Datalake.register WHERE user_id = '${userId}' LIMIT ${cantidad - 1}`;
    const connection = getConnection(AWS_DBASE);
    return await connection.query(sqlCmd)
    .then(data => {
      return data;
    })
    .catch( err => { 
      // Guardar el error en la base de datos
      errorLogsService.addError('del_duplicate_register', err.toString().substring(0, 4000), 'nocode', 0);
      return Promise.reject(err);
    });
  }
}
export const registerService = new RegisterService();
