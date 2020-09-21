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
  public status!: string | '';
  
  @Column({ name: 'access_until', type: 'timestamp' })
  public accessUntil?: string | null;
 
  @Column({ name: 'method_name'})
  public methodName!: string | '';

  @Column()
  public source!: string | '';

  @Column({ type: 'double' })
  public amount!: number | 0;
  
  @Column({ name: 'payment_type'})
  public paymentType!: string | '';

  @Column({ type: 'int' })
  public duration!: number | 0;

  @Column()
  public message!: string | '';

  @Column()
  public event!: string | '';
  
  @Column({ type: 'timestamp' })
  public timestamp?: string | null;

  @Column({ name: 'user_agent', length: 1024 })
  public userAgent!: string | '';
       
  @Column({ type: 'int' })
  public discount!: number | 0; 
  
  @Column({ name: 'payment_id' })
  public paymentId!: string | '';
     
  @Column()
  public package!: string | '';

  @Column({ type: 'tinyint' })
  public trial!: number | 0;   
         
  @Column({ name: 'trial_duration', type: 'int' })
  public trialDuration!: number | 0;
}
