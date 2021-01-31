import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

@Entity({
  name: 'countries',
  database: AWS_DBASE,
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class Country {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public country!: string;

  @Column()
  public currency!: string;

  @Column({ name: 'utc_shift'})
  public utcShift!: number;

  @Column()
  public descripcion!: string;
}
