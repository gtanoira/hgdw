import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'payment_commit',
  database: 'Datalake',
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class PaymentCommit {
  @PrimaryColumn()
  public id: number;

  @Column()
  public status: string;
  
  @Column({
    name: 'is_suscription',
    type: 'tinyint'
  })
  public isSuscription: number;
  
  @Column({
    name: 'user_id'
  })
  public userId: string;
    
  @Column({
    name: 'access_until',
    type: 'timestamp'
  })
  public accessUntil: string;
   
  @Column({
    name: 'method_name'
  })
  public methodName: string;
  
  @Column()
  public source: string;

  @Column({
    type: 'double'
  })
  public amount: number;

  @Column({
    name: 'payment_type'
  })
  public paymentType: string;

  @Column({
    type: 'int'
  })
  public duration: number;
    
  @Column()
  public message: string;
    
  @Column()
  public event: string;
    
  @Column({
    type: 'timestamp'
  })
  public timestamp: string;
  
  @Column({
    type: 'int'
  })
  public discount: number;
      
  @Column({
    name: 'payment_id'
  })
  public paymentId: string;
    
  @Column()
  public package: string;
      
  @Column({
    type: 'tinyint'
  })
  public trial: number;
        
  @Column({ 
    name: 'trial_duration',
    type: 'int'
  })
  public trialDuration: number;
}
