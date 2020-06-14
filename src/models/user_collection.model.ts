import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_collection')
export class UserCollectionModel {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column({ name: 'user_id' })
  public userId: string;
  
  @Column({ name: 'user_activation' })
  public user_activation: string;

  @Column()
  public country: string;
 
  @Column()
  public event: string;
     
  @Column({ type: 'timestamp' })
  public timestamp: string;
     
  @Column({ type: 'datetime', name: 'timestamp_local' })
  public timestampLocal: string;
     
  @Column({ type: 'datetime', name: 'timestamp_ar' })
  public timestampAr: string;
  
  @Column({ name: 'idp_desc' })
  public idpDesc: string;
  
  @Column()
  public source: string;
  
  @Column({ name: 'paym_processor' })
  public paymProcessor: string;
   
  @Column({ name: 'paym_status' })
  public paymStatus: string;
    
  @Column({ name: 'paym_type' })
  public paymType: string;
   
  @Column({ name: 'paym_origin' })
  public paymOrigin: string;
     
  @Column({ name: 'paym_price_type' })
  public paymPriceType: string;
  
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
