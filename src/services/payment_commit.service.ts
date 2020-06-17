// Models
import { PaymentCommit } from '../models/payment_commit.model';

// Databases
import { HotGoDBase } from '../database/index';
import { getConnection } from 'typeorm';

export class PaymentCommitService {

  public async list(): Promise<PaymentCommit[]> {  
    const connection = getConnection('Datalake');
    return await connection.getRepository(PaymentCommit).find();
  }
  
  public async listNew(ultimoId: number): Promise<PaymentCommit[]> {  
    const connection = getConnection('Datalake');
    return await connection.getRepository(PaymentCommit).find({id: 31944})
      /* .createQueryBuilder()
      .where('id > :ultimoId', { ultimoId: ultimoId} )
      .limit(1)
      .getMany(); */
  }
}

export const paymentCommitService = new PaymentCommitService();
