import { getConnection, DeleteResult } from 'typeorm';
import { Observable } from 'rxjs';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models
import { ProcesoBatch } from '../models/proceso_batch.model';

export class ProcesosBatchsService {

  /* // Grabar un proceso en la tabla
  public async addProceso(newBatch: ProcesoBatch): Promise<ProcesoBatch> {
    const connection = getConnection(AWS_DBASE);
    return await connection.getRepository(ProcesoBatch).save(newBatch);
  } */

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

  /* public async getById(id: number): Promise<ProcesoBatch> {
    const connection = getConnection(AWS_DBASE);
    return await connection.getRepository(ProcesoBatch).findOne(id); 
  } */

}

export const procesosBatchsService = new ProcesosBatchsService();
