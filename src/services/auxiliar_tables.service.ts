import { getConnection } from 'typeorm';

// Models
import { FieldStatus } from '../models/field_status.model';

export class AuxiliarTablesService {

  // Tabla FIELD_STATUS: obtener el paym_descripcion de un status dado
  public async fieldStatusGetPaymDescription(xstatus: string): Promise<String> {
    try {
      const connection = getConnection('DWHBP');
      return await connection.getRepository<String>(FieldStatus)
        .createQueryBuilder()
        .where('status = :status', {status} )
        .getOne(); 
    } catch (error) {
      return null;
    }
  }
}

export const auxiliarTablesService = new AuxiliarTablesService();
