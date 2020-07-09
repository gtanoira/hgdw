import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

@Entity({
  name: 'error_logs',
  database: AWS_DBASE,
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class ErrorLog {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'error_type', comment: 'Identificar el tipo de proceso o funcion que generó el error'})
  public errorType: string;

  @Column({ length: 4000, comment: 'Mensaje de error'})
  public message: string;

  @Column({ type: 'timestamp', comment: 'Dia y hora en que se grabó el error'})
  public timestamp: string;
}
