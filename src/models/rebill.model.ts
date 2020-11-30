import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'rebill',
  database: 'Datalake',
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class RebillModel {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ name: 'user_id' })
  public userId!: string;

  @Column()
  public status!: string | '';
 
  @Column({ name: 'access_until', type: 'timestamp' })
  public accessUntil?: string | null;

  @Column({ name: 'rebill_type' })
  public rebillType!: string;
       
  @Column({ type: 'int' })
  public discount!: number | 0; 

  @Column({ type: 'double' })
  public amount!: number | 0;

  @Column()
  public source!: string | '';

  @Column()
  public message!: string | '';

  @Column()
  public event!: string | '';
  
  @Column({ type: 'timestamp' })
  public timestamp?: string | null;

  @Column({ name: 'user_agent', length: 1024 })
  public userAgent!: string | '';

  @Column({ type: 'tinyint' })
  public trial!: number | 0;   
         
  @Column({ name: 'trial_duration', type: 'int' })
  public trialDuration!: number | 0;

  @Column({ type: 'double' })
  public taxableAmount!: number | 0;

  @Column({ type: 'double' })
  public vatAmount!: number | 0;
     
  @Column({ name: 'card_type' })
  public cardType?: string | '';
     
  @Column({ name: 'user_payment_id' })
  public userPaymentId?: string | '';

  @Column({ name: 'method_name'})
  public methodName!: string | '';

  @Column({ type: 'int' })
  public duration!: number | 0;
}
