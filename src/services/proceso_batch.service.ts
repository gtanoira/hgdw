import { Connection } from 'typeorm';

// Models
import { ProcesoBatchModel } from '../models/proceso_batch.model';

// Databases
import { HotGoDWHBPProvider } from '../database/index';

export class ProcesoBatchService {

  public async getById(id: number): Promise<ProcesoBatchModel> {
    const connection = await HotGoDWHBPProvider.getConnection();
    return await connection.getRepository(ProcesoBatchModel).findOne(id); 
  }

  public async list(): Promise<ProcesoBatchModel[]> {
    const connection = await HotGoDWHBPProvider.getConnection();
    return await connection.getRepository(ProcesoBatchModel).find();
  }
}

export const procesoBatchService = new ProcesoBatchService();
