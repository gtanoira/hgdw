import { getConnection, InsertResult } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models
import { ErrorLog } from '../models/error-log.model';

export class ErrorLogsService {

  public async addError(errorType: string, errorMsg: string, errorCode: string, idFk: number | 0): Promise<InsertResult> {
    const connection = getConnection(AWS_DBASE);
    const errorSolved = errorCode === 'nocode' ? 2 : 0;
    return await connection.getRepository(ErrorLog)
      .createQueryBuilder()
      .insert()
      .into(ErrorLog)
      .values([
          { errorType, message: errorMsg, errorCode, errorSolved, idFk }
      ])
      .execute();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async checkErrors(userId: string): Promise<any> {
    const sqlCmd = `CALL pr_check_errors('${userId}')`;
    const connection = getConnection(AWS_DBASE);
    console.log('>*** PASO');
    return await connection.query(sqlCmd);
  }

  public async getAll():Promise<ErrorLog[]> {
    const connection = getConnection(AWS_DBASE);
    return await connection.getRepository(ErrorLog).find();
  }
}
export const errorLogsService = new ErrorLogsService();
