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
  public id!: number;

  @Column({ name: 'error_type', comment: 'Tipo de proceso que generó el error' })
  public errorType!: string | 'not defined';

  @Column({ length: 4000, comment: 'Mensaje de error' })
  public message?: string | '';

  @Column({ type: 'timestamp', comment: 'Dia y hora en que se grabó el error' })
  public timestamp!: string;
  
  @Column({ name: 'error_code', comment: 'Tipo de error' })
  public errorCode!: string | 'nocode';
    
  @Column({ name: 'error_solved', type: 'tinyint', comment: 'Solucionado' })
  public errorSolved!: number | 0;
    
  @Column({ name: 'id_fk', type: 'int', comment: 'Id registro de la tabla donde se produjo el error. (foreign key)' })
  public idFk!: number | 0;
}
