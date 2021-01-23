import { getConnection  } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models & Interfaces
import { ProductLocalPrice } from '../models/product-local-price.model';
interface getAllParams {
  duration?: string,
  pageNo?: number,
  recsPage?: number,
  sortField?: string,
  sortDirection?: string
}

export class ProductLocalPricesService {

  // Borrar un registro de la tabla
  /* public async delById(id: number): Promise<string> {
    const sqlCmd = `CALL pr_delete_batch(${id})`;
    const connection = getConnection(AWS_DBASE);
    return await connection.query(sqlCmd)
    .then(
      data => {
        const dataMessage: string = JSON.stringify(data);
        const rtnMessage = JSON.parse(dataMessage);
        console.log('');
        console.log(rtnMessage[1][0]);
        return rtnMessage[1][0].sqlResult;
      }
    )
    .catch(
      err => {
        return Promise.reject(err);
      }
    );
  } */

  public async getAll({
    duration = '',
    pageNo = 1,
    recsPage = 10000,
    sortField = '',
    sortDirection = 'ASC'
  }: getAllParams):Promise<ProductLocalPrice[]> {

    // Create query params
    const connection = getConnection(AWS_DBASE)
    const orderBy = sortDirection ? sortDirection.toUpperCase() : `ASC`;
    const cmdSql =  connection.getRepository(ProductLocalPrice)
    .createQueryBuilder('prices')
    .select('prices.id', 'id')
    .addSelect('prices.fecha', 'fecha')
    .addSelect('prices.country', 'country')
    .addSelect('prices.currency', 'currency')
    .addSelect('prices.duration', 'duration')
    .addSelect('CONVERT(prices.taxable_amount, DECIMAL(12,2))', 'taxableAmount')
    .where(duration ? `duration = cast('${duration}' as unsigned)` : '')
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

export const productLocalPricesService = new ProductLocalPricesService();
