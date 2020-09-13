import { getConnection } from 'typeorm';
import fileSave from 'fs';

// Envirnoment
import { AWS_DBASE, STATIC_PATH } from '../settings/environment.settings';

// Models
import { FieldStatus } from '../models/field_status.model';
import { Country } from '../models/country.model';

export class AuxiliarTablesService {

  private paises: Country[] = []; // se usa para cachear la tabla paises
  // se usa para cachear la tabla paises
  private fieldStatus: FieldStatus[] = [];

  /*
   * Tabla FIELD_STATUS
   */
  // Obtener el paymStatus de un status dado
  public async getPaymStatus(status: string): Promise<string | null> {
    // Verificar que se haya cacheado la tabla
    if (!this.fieldStatus || this.fieldStatus.length <= 0) {
      await this.getFieldStatus().then( data => this.fieldStatus = data );
    }
    const recFind  = this.fieldStatus.find( el => el.status === status);
    return recFind ? recFind.paymStatus : null;
  }

  public async getFieldStatus(): Promise<FieldStatus[]> {
    const connection = getConnection(AWS_DBASE);
    return await connection.getRepository(FieldStatus).find();
  }

  /*
   * Tabla PAISES
   */
  // Buscar la moneda de un país (se usa el cache)
  public async getMonedaPais(country: string): Promise<string | null> {
    // Verificar que se haya cacheado los paises
    if (!this.paises) {
      await this.getPaises().then( data => this.paises = data );
    }
    const recFind  = this.paises.find( registro => registro.paisId === country);
    return recFind ? recFind.monedaId : null;
  }

  public async getPaises(): Promise<Country[]> {
    const connection = getConnection(AWS_DBASE);
    return await connection.getRepository(Country).find();
  }

  /*
     Guardar los INSERT INTO a la tabla HGDW.titles_metadata_published
  */
  public saveDataToFile(filename: string, dataToSave: string): void {
    fileSave.writeFile(`${STATIC_PATH}/downloads/${filename}`, dataToSave, (err) => {
      console.log('*** SAVEFILE:', err);
      return;
    });
  }
}

export const auxiliarTablesService = new AuxiliarTablesService();
