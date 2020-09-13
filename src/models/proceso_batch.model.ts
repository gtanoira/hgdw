import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

@Entity({
  name: 'procesos_batchs',
  database: AWS_DBASE,
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class ProcesoBatch {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ name: 'ultimo_timestamp_lote', type: 'timestamp' })
  public ultimoTimestampLote!: string;

  @Column()
  public tabla!: string;
  
  @Column({ length: 1000 })
  public resultado?: string;
  
  @Column({ name: 'id_fk', type: 'int', nullable: false })
  public idFk!: number;
  
  @Column({ name: 'alta_date', type: 'timestamp', default: 'CURRENT_TIMESTAMP' })
  public altaDate?: string;
    
  @Column({ name: 'alta_user' })
  public altaUser?: string;
}
