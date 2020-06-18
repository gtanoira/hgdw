import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({
  name: 'procesos_batchs',
  database: 'DWHBP',
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class ProcesosBatch {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ name: 'ultimo_timestamp_lote', type: 'timestamp' })
  public ultimoTimestampLote: string;

  @Column()
  public tabla: string;
  
  @Column({ length: 1000 })
  public resultado?: string;
  
  @Column({  name: 'id_fk', type: 'int', nullable: false })
  public idFk: number;
  
  @Column({ name: 'alta_date', type: 'timestamp', default: 'CURRENT_TIMESTAMP' })
  public altaDate?: string;
    
  @Column({ name: 'alta_user' })
  public altaUser?: string;
}
