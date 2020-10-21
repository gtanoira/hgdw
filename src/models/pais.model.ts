import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

@Entity({
  name: 'countries',
  database: AWS_DBASE,
  synchronize: false  // no incluir en migration
})
export class Pais {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public country!: string;

  @Column()
  public currency!: string;
  
  @Column({ name: 'utc_shift', type: 'int', default: 0 })
  public utcShift?: number;
  
  @Column({ name: 'descripcion', default: null })
  public name?: string;
}
