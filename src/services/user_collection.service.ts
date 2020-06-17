import { Connection, getConnection } from 'typeorm';

// Models
import { ProcesosBatch } from '../models/proceso_batch.model';
import { UserCollection } from '../models/user_collection.model';

// Databases
import { HotGoDBase } from '../database/index';

// Services
import { emailService } from '../services/email.service';
import { paymentCommitService } from '../services/payment_commit.service'

export class UserCollectionService {

  // Grabar un nuevo registro en la tabla
  public async create(userCollection: UserCollection): Promise<UserCollection> {
    const connection = getConnection('DWHBP');
    return await connection.getRepository(UserCollection).save(userCollection);
  }

  // Listar todos los registros de la tabla
  public async list(): Promise<UserCollection[]> {  
    const connection = getConnection('DWHBP');
    return await connection.getRepository(UserCollection).find();
  }

}

export const userCollectionService = new UserCollectionService();
