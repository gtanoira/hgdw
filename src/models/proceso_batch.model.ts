import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('DWHBP.procesos_batchs')
export class ProcesoBatchModel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({name: 'ultimo_timestamp_lote'})
  public ultimoTimestampLote: string;

  @Column()
  public tabla: string;
  
  @Column({ length: 1000 })
  public resultado: string;
  
  @Column({ name: 'id_fk'})
  public idFk: number;
  
  @Column({ name: 'alta_date'})
  public altaDate: string;
    
  @Column({ name: 'alta_user'})
  public altaUser: string;
}
