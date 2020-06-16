import { getConnection } from 'typeorm';

// Models
import { ProcesosBatch } from '../models/proceso_batch.model';

export class ProcesoBatchService {

  public async getById(id: number): Promise<ProcesosBatch> {
    const connection = getConnection('DWHBP');
    return await connection.getRepository(ProcesosBatch).findOne(id); 
  }

  public async list(): Promise<ProcesosBatch[]> {
    const connection = getConnection('DWHBP');
    return await connection.getRepository(ProcesosBatch).find();
  }
}

export const procesoBatchService = new ProcesoBatchService();
