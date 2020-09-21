import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Envirnoment

@Entity({
  name: 'payment_commit',
  database: 'Datalake',
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class PaymentCommitModel {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ name: 'user_id' })
  public userId!: string;
  
  @Column()
  public event!: string | '';

  @Column({ type: 'timestamp' })
  public timestamp?: string | null;

  @Column()
  public status!: string | '';
  
  @Column({ name: 'access_until', type: 'timestamp' })
  public accessUntil?: string | null;
  
  @Column({ name: 'method_name'})
  public methodName!: string | '';

  @Column()
  public source!: string | '';

  @Column({ name: 'payment_type'})
  public paymentType!: string | '';

  @Column({ type: 'int' })
  public duration!: number | 0;
 
  @Column({ type: 'tinyint' })
  public trial!: number | 0; 
  
  @Column()
  public currency!: string | '';
  
}
interface PaymentCommitModel {
  user_id: string;
  event?: string | '';
  timestamp: string | '';
  status?: string | '';
  access_until?: string | '';
  method_name?: string | '';
  source?: string | '';
  payment_type?: string | '';
  duration?: number | 0;
  trial?: number | 0;
  currency?: string | '';
  taxable_amount?: number | 0;
  vat_amount?: number | 0;
  amount?: number | 0;
  discount?: number | 0;
  user_payment_id?: string | '';
}