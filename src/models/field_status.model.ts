import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'field_status',
  database: 'DWHBP',
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class FieldStatus {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ comment: 'Valor que viene de las tablas del Datalake'})
  public status: string;

  @Column({ name: 'paym_status', comment: 'Resultado que se obtiene del valor dado por status: aprobado / no aprobado'})
  public paymStatus: string;
}
