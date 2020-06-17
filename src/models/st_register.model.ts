import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({
  name: 'st_register',
  database: 'DWHBP',
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class StRegister {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'user_id', comment: 'Id HotGo del usuario'})
  @Index()
  public userId: string;

  @Column({ comment: 'Tipo de registro o evento'})
  public event: string;

  @Column({ comment: 'Plataforma donde se registró' })
  public source: string;

  @Column()
  public name: string;
  
  @Column()
  public lastname: string;
  
  @Column()
  public email: string;
  
  @Column({ comment: 'País de oirgen'})
  public country: string;
  
  @Column({ name: 'idp_id', comment: 'Id Cableoperador o Id Hotgo'})
  public idpId: string;
  
  @Column({ type: 'timestamp', comment: 'Dia y hora del alta en HotGo en UTC'})
  public timestamp: string;
  
  @Column({ type: 'datetime', comment: 'Dia y hora del alta en HotGo en hora País'})
  public timestamp_local: string;

  @Column({ type: 'datetime', comment: 'Dia y hora del alta en HotGo en Argentina'})
  public timestamp_ar: string;
    
  @Column()
  public version: string;
    
  @Column({ name: 'query_string' })
  public queryString: string;

  @Column({ name: 'email_valid', type: 'tinyint' })
  public emailValid: number;
  
  @Column({ name: 'id_fk', type: 'int' })
  public idFk: number;
}
