import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'EVENTS',
  database: 'INFORMATION_SCHEMA',
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class ScheduleEvent {
  @PrimaryColumn({ name: 'event_name' })
  public eventName!: string;

  @Column({ name: 'interval_value' })
  public intervalValue!: string;
 
  @Column({ name: 'interval_field' })
  public intervalField!: string;
 
  @Column({ name: 'last_executed', type: 'datetime' })
  public lastExecuted!: string;
  
  @Column()
  public status!: string; 
}
