import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'paises',
  database: 'DWHBP',
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class Pais {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'pais_id', comment: 'Id del país según ISO-9000 de 2 caracteres'})
  public paisId: string;

  @Column({ name: 'moneda_id', comment: 'ID de la moneda del país, ej: ARS, CLP, BRL, COP, UYU, etc.'})
  public monedaId: string;

  @Column({ name: 'utc_shift', type: 'int', comment: 'Cantidad de horas que hay que sumar o restar al tiempo UTC (estandard)'})
  public utcShift: string;

  @Column()
  public descripcion: string;
}
