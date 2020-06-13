import { Connection } from 'typeorm';

// Models
import { ProcesoBatchModel } from '../models/proceso_batch.model';

// Databases
import { HotGoAwsProvider } from '../database/index';

export class ProcesoBatchService {

  public async getById(id: number): Promise<ProcesoBatchModel> {
    const connection = await HotGoAwsProvider.getConnection();
    return await connection.getRepository(ProcesoBatchModel).findOne(id); 

  }

  /* public async create(procesoBatch: ProcesoBatchModel): Promise<ProcesoBatchModel> {
    // Normally DTO !== DB-Entity, so we "simulate" a mapping of both
    const newProcesoBatch = new ProcesoBatchModel();
    newProcesoBatch.ultimo_timestamp_lote = procesoBatch.ultimoTimestampLote;
    newProcesoBatch.tabla = procesoBatch.tabla;

    const connection = await HotGoAwsProvider.getConnection();
    return await connection.getRepository<ProcesoBatchModel>(ProcesoBatchModel).save(newProcesoBatch);
  } */

  public async list(): Promise<ProcesoBatchModel[]> {
        
    const connection = await HotGoAwsProvider.getConnection();
    return await connection.getRepository(ProcesoBatchModel).find();
  }

  /* public async update(procesoBatch: ProcesoBatchModel): Promise<ProcesoBatchModel> {
    console.log(procesoBatch);
    const connection = await HotGoAwsProvider.getConnection();
    const repository = connection.getRepository(ProcesoBatchModel);
    const entity = await repository.findOneById(procesoBatch.id);
    entity.ultimoTimestampLote = procesoBatch.ultimoTimestampLote;
    entity.tabla = procesoBatch.tabla;
    return await repository.save(entity);
  }

  public async delete(id: number): Promise<void> {
    const connection = await HotGoAwsProvider.getConnection();
    return await connection.getRepository(ProcesoBatchModel).removeById(id)
  } */
}

export const procesoBatchService = new ProcesoBatchService();
