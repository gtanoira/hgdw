import { getConnection, QueryRunner } from 'typeorm';

export class RebillService {

  private queryRunner?: QueryRunner;

  // Ejecutar in INSERT INTO bulk sobre la tabla Datalake.rebill
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async insertMissingRebill(sqlCmd: string): Promise<any> {
    const connection = getConnection('Datalake');
    return await connection.query(sqlCmd);
  }

  /* *********************************************************************************************
    Rutinas para el inicio - commit - rollback de transacciones
  */
  // Iniciar una transaccion START TRANSACTION
  public async startTransaction(): Promise<void> {
    console.log('*** START TRANSACTION');
    const connection = getConnection('Datalake');
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
export const rebillService = new RebillService();
