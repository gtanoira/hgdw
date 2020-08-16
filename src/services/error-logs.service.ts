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

  public async addError(errorType: string, errorMsg: string) {
    const connection = getConnection(AWS_DBASE);
    return await connection.getRepository(ErrorLog)
      .createQueryBuilder()
      .insert()
      .into(ErrorLog)
      .values([
          { errorType, message: errorMsg }
      ])
      .execute();
  }
}
export const errorLogsService = new ErrorLogsService();
