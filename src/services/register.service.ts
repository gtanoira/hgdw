import { getConnection, QueryRunner } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models

// Services
import { errorLogsService } from './error-logs.service';

export class RegisterService {

  private queryRunner?: QueryRunner;

  // Ejecutar in INSERT INTO bulk sobre la tabla history_register
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async insertRegisterHistory(sqlCmd: string): Promise<any> {
    const connection = getConnection(AWS_DBASE);
    return await connection.query(sqlCmd);
  }

  // Ejecutar in INSERT INTO bulk sobre la tabla Datalake.register
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async insertMissingRegister(sqlCmd: string): Promise<any> {
    const connection = getConnection('Datalake');
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
export const registerService = new RegisterService();
