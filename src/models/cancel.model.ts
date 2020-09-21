import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Envirnoment

@Entity({
  name: 'cancel',
  database: 'Datalake',
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class CancelModel {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ name: 'user_id' })
  public userId!: string;

  @Column()
  public source!: string | '';

  @Column()
  public event!: string | '';

  @Column()
  public channel!: string | '';
    
  @Column({ type: 'timestamp' })
  public timestamp?: string | null;

  @Column({ name: 'access_until', type: 'timestamp' })
  public accessUntil?: string | null;

  @Column({ name: 'user_agent', length: 1024 })
  public userAgent!: string | '';
}
