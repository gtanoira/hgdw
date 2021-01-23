import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Interfaces
class LocalPricesROobject {
  id!: number;
  fecha!: string;
  country!: string;
  currency!: string;
  duration!: number;
  taxableAmount!: number;
}

@Entity({
  name: 'product_local_prices',
  database: AWS_DBASE,
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class ProductLocalPrice {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'datetime' })
  public fecha!: string;

  @Column()
  public country!: string;
 
  @Column()
  public currency!: string;
  
  @Column({ type: 'int', default: null })
  public duration?: number;
  
  @Column({ name: 'taxable_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  public taxableAmount?: number;

}

// What to show as response from a http request
export function localPriceToResponse(localPrice: ProductLocalPrice): LocalPricesROobject {
  const responseObj = { 
    id: +localPrice.id,
    fecha: localPrice.fecha,
    country: localPrice.country,
    currency: localPrice.currency,
    duration: localPrice.duration ? localPrice.duration : 0,
    taxableAmount: localPrice.taxableAmount ? Number(localPrice.taxableAmount) : 0
  };
  return responseObj;
}

