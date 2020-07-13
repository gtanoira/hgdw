import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

@Entity({
  name: 'paises',
  database: AWS_DBASE,
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class Country {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ name: 'pais_id', comment: 'Id del país según ISO-9000 de 2 caracteres' })
  public paisId!: string;

  @Column({ name: 'moneda_id', comment: 'ID de la moneda del país, ej: ARS, CLP, BRL, COP, UYU, etc.' })
  public monedaId!: string;

  @Column({ name: 'utc_shift', type: 'int', comment: 'Cantidad de horas que hay que sumar o restar al tiempo UTC (estandard)' })
  public utcShift!: number;

  @Column()
  public descripcion!: string;
}
