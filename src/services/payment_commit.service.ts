// Models
import { PaymentCommit } from '../models/payment_commit.model';

// Databases
import { HotGoDBase } from '../database/index';
import { getConnection } from 'typeorm';

export class PaymentCommitService {

  public async list(): Promise<PaymentCommit[]> {  
    const connection = await HotGoDBase.setConnection('Datalake');
    return await connection.getRepository(PaymentCommit).find();
  }
  
  public async listNew(ultimoId: number): Promise<PaymentCommit[]> {  
    const connection = await HotGoDBase.setConnection('Datalake');
    console.log('*** 4', ultimoId, connection);
    return getConnection('Datalake').createQueryBuilder()
      .where('id > :ultimoId', { ultimoId: ultimoId} )
      .getMany();
    /* return await connection.getRepository(PaymentCommit)
      .createQueryBuilder()
      .where('id > :ultimoId', { ultimoId: ultimoId} )
      .getMany(); */
  }
}

export const paymentCommitService = new PaymentCommitService();
