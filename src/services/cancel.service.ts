import { getConnection } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models

// Services

export class CancelService {

  // Ejecutar in INSERT INTO bulk sobre la tabla history_cancel
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async insertCancelHistory(sqlCmd: string): Promise<any> {
    const connection = getConnection(AWS_DBASE);
    return await connection.query(sqlCmd);
  }

}
export const cancelService = new CancelService();
