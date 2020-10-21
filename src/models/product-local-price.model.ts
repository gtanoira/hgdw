import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

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
