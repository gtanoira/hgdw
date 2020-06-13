import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('DWHBP.procesos_batchs')
export class ProcesoBatchModel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({name: 'ultimo_timestamp_lote'})
  public ultimoTimestampLote: string;

  @Column()
  public tabla: string;
}
