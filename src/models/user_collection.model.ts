import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

@Entity({
  name: 'user_collections',
  database: AWS_DBASE,
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class UserCollection {
  @Column({ comment: 'ID sintético' })
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column({ name: 'user_id' })
  public userId: string;
 
  @Column({ comment: 'Tipo de evento: payment_commit / rebill' })
  public event: string;
     
  @Column({ type: 'timestamp' })
  public timestamp: string;
  
  @Column()
  public source: string;
  
  @Column({ comment: 'Mensaje de status del procesador de pagos'})
  public status: string;
  
  @Column({ name: 'paym_description', comment: 'Alta / Reactivación / Recobro / Rechazado' })
  public paymDescription: string;
  
  @Column({ name: 'paym_processor', comment: 'Procesador de pago. Este campo solo se llena de payment_commit.' })
  public paymProcessor: string;
   
  @Column({ name: 'paym_status' })
  public paymStatus: string;
    
  @Column({ name: 'paym_type' })
  public paymType: string;
   
  @Column({ name: 'paym_origin' })
  public paymOrigin: string;
  
  @Column()
  public message: string;
 
  @Column({ type: 'int' })
  public duration: number;
        
  @Column({ type: 'tinyint' })
  public trial: number;
        
  @Column({ type: 'int', name: 'trial_duration' })
  public trialDuration: number;
    
  @Column()
  public package: string;
          
  @Column({ type: 'tinyint', name: 'is_suscription' })
  public isSuscription: number;
       
  @Column({ type: 'timestamp', name: 'access_until' })
  public accessUntil: string;
  
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  public amount: number;
    
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  public discount: number;
      
  @Column()
  public currency: string;
      
  @Column({ type: 'decimal', precision: 13, scale: 6, name: 'exch_rate' })
  public exchRate: number;
        
  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'amount_usd' })
  public amountUsd: number;
          
  @Column({ type: 'int', name: 'id_fk' })
  public idFk: number;
}
