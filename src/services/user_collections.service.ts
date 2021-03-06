import { getConnection, QueryRunner } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models

// Services

export class UserCollectionsService {

  // Ejecutar in INSERT INTO bulk sobre la tabla history_payment_commit
  public async insertPaymentCommitHistory(sqlCmd: string): Promise<QueryRunner | undefined> {
    const connection = getConnection(AWS_DBASE);
    return await connection.query(sqlCmd);
  }

  // Ejecutar in INSERT INTO bulk sobre la tabla history_rebill
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async insertRebillHistory(sqlCmd: string): Promise<any> {
    const connection = getConnection(AWS_DBASE);
    return await connection.query(sqlCmd);
  }

}
export const userCollectionsService = new UserCollectionsService();
