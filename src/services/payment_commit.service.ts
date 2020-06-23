import { getConnection } from 'typeorm';

// Models

export class PaymentCommitService {

  // Grabar un proceso en la tabla
  public async actualizar(user: string): Promise<any> {
    return await getConnection('DWHBP').query(`CALL pr_update_payment_commit('${user}')`);
  }
}

export const paymentCommitService = new PaymentCommitService();
