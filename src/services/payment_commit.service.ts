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
    return await connection.getRepository(PaymentCommit)
      .createQueryBuilder()
      .where('id > :ultimoId', { ultimoId: ultimoId} )
      .limit(100)
      .getMany();
  }
}

export const paymentCommitService = new PaymentCommitService();
