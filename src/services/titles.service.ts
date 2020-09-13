import { getConnection, QueryRunner } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models

// Services

export class TitlesService {

  private queryRunner?: QueryRunner;

  // Ejecutar in INSERT INTO bulk sobre la tabla history_register
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async insertPublishedTitles(sqlCmd: string): Promise<any> {
    return await this.queryRunner?.query(sqlCmd);
  }

  // Iniciar una transaccion START TRANSACTION
  public async startTransaction(): Promise<void> {
    console.log('*** START TRANSACTION');
    const connection = getConnection(AWS_DBASE);
    this.queryRunner = connection.createQueryRunner();
    await this.queryRunner.connect();  // Establish real database connection
    return await this.queryRunner.startTransaction(); // Open a new transaction
  }

  // Finalizar una transaccion COMMIT
  public async commitTransaction(): Promise<void> {
    console.log('*** COMMIT');
    /* const connection = getConnection(AWS_DBASE);
    const sqlCmd = 'COMMIT';
    return await connection.query(sqlCmd); */
    return await this.queryRunner?.commitTransaction();
  }

  // Finalizar una transaccion ROLLBACK
  public async rollbackTransaction(): Promise<void> {
    console.log('*** ROLLBACK');
    /* const connection = getConnection(AWS_DBASE);
    const sqlCmd = 'ROLLBACK';
    return await connection.query(sqlCmd); */
    return await this.queryRunner?.rollbackTransaction();
  }
  
  // Finalizar una transaccion via QueryRunner
  public async endTransaction(): Promise<void> {
    console.log('*** END TRANSACTION');
    return await this.queryRunner?.release();
  }

}
export const titlesService = new TitlesService();
