import { Entity, Column, PrimaryGeneratedColumn, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('payment_commit')
export class PaymentCommitModel {
  @PrimaryColumn()
  public id: number;

  @Column()
  public status: string;
  
  @Column({ name: 'is_suscription' })
  public isSuscription: number;
  
  @Column({ name: 'user_id' })
  public userId: string;
    
  @Column({ name: 'access_until' })
  public accessUntil: string;
   
  @Column({ name: 'method_name' })
  public methodName: string;
  
  @Column()
  public source: string;

  @Column({ type: 'double' })
  public amount: number;

  @Column({ name: 'payment_type' })
  public paymentType: string;

  @Column()
  public duration: number;
    
  @Column()
  public message: string;
    
  @Column()
  public event: string;
    
  @Column()
  public timestamp: string;
  
  @Column()
  public discount: number;
      
  @Column({ name: 'payment_id' })
  public paymentId: string;
    
  @Column()
  public package: string;
      
  @Column()
  public trial: number;
        
  @Column({ name: 'trial_duration' })
  public trialDuration: number;
}
