import { getConnection, DeleteResult } from 'typeorm';
import { Observable } from 'rxjs';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models
import { ProcesoBatch } from '../models/proceso_batch.model';

export class ProcesosBatchsService {

  // Borrar un registro de la tabla
  public async delById(id: number): Promise<DeleteResult> {
    const connection = getConnection(AWS_DBASE);
    return await connection.getRepository(ProcesoBatch)
      .createQueryBuilder()
      .delete()
      .where("id = :id", { id })
      .execute();
  }

  public async getAll():Promise<ProcesoBatch[]> {
    const connection = getConnection(AWS_DBASE);
    return await connection.getRepository(ProcesoBatch).find();
  }
}

export const procesosBatchsService = new ProcesosBatchsService();
