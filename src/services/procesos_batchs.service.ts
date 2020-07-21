import { getConnection, DeleteResult } from 'typeorm';
import { Observable } from 'rxjs';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models
import { ProcesoBatch } from '../models/proceso_batch.model';

export class ProcesosBatchsService {

  // Borrar un registro de la tabla
  public async delById(id: number): Promise<string> {
    const sqlCmd = `CALL pr_delete_batch(${id})`;
    const connection = getConnection(AWS_DBASE);
    return await connection.query(sqlCmd);
  }

  public async getAll():Promise<ProcesoBatch[]> {
    const connection = getConnection(AWS_DBASE);
    return await connection.getRepository(ProcesoBatch).find();
  }
}

export const procesosBatchsService = new ProcesosBatchsService();
