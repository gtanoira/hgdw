import { Connection } from 'typeorm';

// Models
import { PaymentCommitModel } from '../models/payment_commit.model';

// Databases
import { HotGoDatalakeProvider } from '../database/index';

export class PaymentCommitService {

  public async list(): Promise<PaymentCommitModel[]> {  
    const connection = await HotGoDatalakeProvider.getConnection();
    return await connection.getRepository(PaymentCommitModel).find();
  }
}

export const paymentCommitService = new PaymentCommitService();
