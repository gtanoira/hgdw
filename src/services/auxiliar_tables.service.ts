import { getConnection } from 'typeorm';

// Models
import { FieldStatus } from '../models/field_status.model';
import { Pais } from '../models/paises.model';

export class AuxiliarTablesService {

  // Tabla FIELD_STATUS: obtener el paym_descripcion de un status dado
  public async getPaymStatus(status: string): Promise<FieldStatus> {
    try {
      const connection = getConnection('DWHBP');
      return await connection.getRepository(FieldStatus).findOne({ status: status});
    } catch (error) {
      return null;
    }
  }
}

export const auxiliarTablesService = new AuxiliarTablesService();
