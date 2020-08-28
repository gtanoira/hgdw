import { getConnection } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models

// Services

export class TitlesService {

  // Ejecutar in INSERT INTO bulk sobre la tabla history_register
  public async insertPublishedTitles(sqlCmd: string): Promise<any> {
    const connection = getConnection(AWS_DBASE);
    return await connection.query(sqlCmd);
  }
}
export const titlesService = new TitlesService();
