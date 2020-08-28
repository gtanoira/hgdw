import { getConnection, QueryRunner } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';
import { query } from 'express';

// Models

// Services

export class TitlesService {

  private queryRunner: QueryRunner | undefined;

  // Ejecutar in INSERT INTO bulk sobre la tabla history_register
  public async insertPublishedTitles(sqlCmd: string): Promise<any> {
    return await this.queryRunner?.query(sqlCmd);
  }

  // Iniciar una transaccion START TRANSACTION
  public async startTransaction(): Promise<any> {
    console.log('*** START TRANSACTION');
    const connection = getConnection(AWS_DBASE);
    this.queryRunner = connection.createQueryRunner();
    await this.queryRunner.connect();  // Establish real database connection
    await this.queryRunner.startTransaction(); // Open a new transaction
  }

  // Finalizar una transaccion COMMIT
  public async commitTransaction(): Promise<any> {
    console.log('*** COMMIT');
    /* const connection = getConnection(AWS_DBASE);
    const sqlCmd = 'COMMIT';
    return await connection.query(sqlCmd); */
    return await this.queryRunner?.commitTransaction();
  }

  // Finalizar una transaccion ROLLBACK
  public async rollbackTransaction(): Promise<any> {
    console.log('*** ROLLBACK');
    /* const connection = getConnection(AWS_DBASE);
    const sqlCmd = 'ROLLBACK';
    return await connection.query(sqlCmd); */
    return await this.queryRunner?.rollbackTransaction();
  }
  
  // Finalizar una transaccion via QueryRunner
  public async endTransaction(): Promise<any> {
    console.log('*** END TRANSACTION');
    await this.queryRunner?.release();
  }

}
export const titlesService = new TitlesService();
