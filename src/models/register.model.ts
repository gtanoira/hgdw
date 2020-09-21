import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Envirnoment

@Entity({
  name: 'register',
  database: 'Datalake',
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class Register {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ name: 'user_id' })
  public userId!: string;

  @Column()
  public event!: string | '';

  @Column()
  public source!: string | '';

  @Column()
  public name!: string | '';

  @Column()
  public lastname!: string | '';

  @Column()
  public email!: string | '';

  @Column()
  public country!: string | '';

  @Column()
  public idp!: string | '';  
  
  @Column({ type: 'timestamp' })
  public timestamp?: string | null;
}
