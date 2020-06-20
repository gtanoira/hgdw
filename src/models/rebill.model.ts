import { Entity, Column, PrimaryColumn, AfterLoad } from 'typeorm';

@Entity({
  name: 'rebill',
  database: 'Datalake',
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class Rebill {
  @PrimaryColumn()
  public id: number;

  @Column()
  public status: string;

  @Column({
    name: 'user_id'
  })
  public userId: string;

  @Column({
    name: 'access_until',
    type: 'timestamp'
  })
  public accessUntil: string;
  
  @Column({
    name: 'rebill_type'
  })
  public rebillType: string;

  @Column({
    type: 'int'
  })
  public discount: number;

  @Column({
    type: 'double'
  })
  public amount: number;

  @Column()
  public source: string;

  @Column()
  public message: string;

  @Column()
  public event: string;

  @Column({
    type: 'timestamp'
  })
  public timestamp: string;

  @Column({
    name: 'user_agent',
    type: 'varchar',
    length: 1024
  })
  public userAgent: string;

  @Column({
    type: 'tinyint',
    zerofill: true
  })
  public trial: number;

  @Column({
    name: 'trial_duration',
    type: 'int',
    zerofill: true
  })
  public trialDuration: number;
  
  // Triggers 
  @AfterLoad()
    fillZeros() {
      if (this.trial === null) this.trial = 0;
      if (this.trialDuration === null) this.trialDuration = 0;
    }
}
