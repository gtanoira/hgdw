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
      .where('id > :ultimoId', { ultimoId: ultimoId} )  // ultimoId
      .getMany();
  }

  // Obtener el valor del campo UserCollection.paymDescription
  public async getPaymDescription(payment: PaymentCommit): Promise<String> {

    // Buscar si existe otro payment del usuario anterior a este pago
    try {
      const connection = getConnection('Datalake');
      const paymentCommit = await connection.getRepository(PaymentCommit)
        .createQueryBuilder()
        .select('1')
        .where("user_id = :userId", {userId: payment.userId})
        .andWhere("timestamp <= :timestamp", {timestamp: payment.timestamp})
        .andWhere("payment_type = :paymType", {paymType: payment.paymentType})
        .andWhere("DWHBP.fn_paym_status(status) = 'aprobado'")
        .orderBy("timestamp", "DESC")
        .getOne();

      return 'reactivacion';

    } catch (error) {
      return 'alta';
    }
  }
}

export const paymentCommitService = new PaymentCommitService();
