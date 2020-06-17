import { getConnection } from 'typeorm';

// Models
import { FieldStatus } from '../models/field_status.model';
import { Pais } from '../models/paises.model';

export class AuxiliarTablesService {

  private paises: Pais[];  // se usa para cachear la tabla paises
  private fieldStatus: FieldStatus[];

  /*
   * Tabla FIELD_STATUS
   */
  // Obtener el paymStatus de un status dado
  public async getPaymStatus(status: string): Promise<String> {
    // Verificar que se haya cacheado la tabla
    if (!this.fieldStatus) {
      await this.getFieldStatus().then( data => this.fieldStatus = data );
    }
    return this.fieldStatus.find( registro => registro.status === status).paymStatus;
  }

  public async getFieldStatus(): Promise<FieldStatus[]> {
    const connection = getConnection('DWHBP');
    return await connection.getRepository(FieldStatus).find();
  }

  /*
   * Tabla PAISES
   */
  // Buscar la moneda de un país (se usa el cache)
  public async getMonedaPais(country: string): Promise<String> {
    // Verificar que se haya cacheado los paises
    if (!this.paises) {
      await this.getPaises().then( data => this.paises = data );
    }
    return this.paises.find( registro => registro.paisId === country).monedaId;
  }

  public async getPaises(): Promise<Pais[]> {
    const connection = getConnection('DWHBP');
    return await connection.getRepository(Pais).find();
  }
}

export const auxiliarTablesService = new AuxiliarTablesService();
