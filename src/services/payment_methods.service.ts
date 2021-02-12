import { DeleteResult, getConnection, InsertResult, UpdateResult  } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models & Interfaces
import { PaymentMethod } from '../models/payment_method.model';
interface getAllParams {
  country?: string,
  pageNo?: number,
  recsPage?: number,
  sortField?: string,
  sortDirection?: string
}

export class PaymentMethodsService {

  public async getRecords({
    country = '',
    pageNo = 1,
    recsPage = 10000,
    sortField = '',
    sortDirection = 'ASC'
  }: getAllParams):Promise<PaymentMethod[]> {

    // Create query params
    const connection = getConnection(AWS_DBASE);
    const orderBy = sortDirection ? sortDirection.toUpperCase() : `ASC`;
    const cmdSql =  connection.getRepository(PaymentMethod)
    .createQueryBuilder('paymet')
    .select('paymet.id', 'id')
    .addSelect('paymet.paym_processor', 'paymProcessor')
    .addSelect('paymet.country', 'country')
    .addSelect('paymet.currency', 'currency')
    .addSelect('CONVERT(paymet.amount, DECIMAL(16,2))', 'amount')
    .addSelect('paymet.trial', 'trial')
    .where(country ? `country = '${country}'` : '')
    .orderBy(sortField ? sortField : '', orderBy === 'ASC' ? 'ASC' : 'DESC')
    .skip(pageNo ? ((pageNo - 1) * recsPage) : 0)
    .take(recsPage ? recsPage : 10000)
    .getSql();

    return await connection.query(cmdSql)
    .catch(error => {
      return Promise.reject(error.message);
    });
  }
}

export const paymentMethodsService = new PaymentMethodsService();
