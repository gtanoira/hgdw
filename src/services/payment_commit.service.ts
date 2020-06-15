// Models
import { PaymentCommitModel } from '../models/payment_commit.model';

// Databases
import { HotGoDatalakeProvider } from '../database/index';

export class PaymentCommitService {

  public async list(): Promise<PaymentCommitModel[]> {  
    const connection = await HotGoDatalakeProvider.getConnection();
    return await connection.getRepository(PaymentCommitModel).find();
  }
  
  public async listNew(ultimoId: number): Promise<PaymentCommitModel[]> {  
    console.log('*** 3', ultimoId);
    const connection = await HotGoDatalakeProvider.getConnection();
    return await connection.getRepository(PaymentCommitModel)
      .createQueryBuilder()
      .where('id > :ultimoId', { ultimoId: ultimoId} )
      .getMany();
  }
}

export const paymentCommitService = new PaymentCommitService();
