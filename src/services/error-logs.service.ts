import { getConnection, DeleteResult } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models
import { ErrorLog } from '../models/error-log.model';

export class ErrorLogsService {

  public async getAll():Promise<ErrorLog[]> {
    const connection = getConnection(AWS_DBASE);
    return await connection.getRepository(ErrorLog).find();
  }

  public async addError(errorType: string, errorMsg: string, errorCode: string, idFk: number | 0) {
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
}
export const errorLogsService = new ErrorLogsService();
