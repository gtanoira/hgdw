import { getConnection } from 'typeorm';

// Models
import { UserCollection } from '../models/user_collection.model';

export class UserCollectionService {

  // Listar todos los registros de la tabla
  public async list(): Promise<UserCollection[]> {  
    const connection = getConnection('DWHBP');
    return await connection.getRepository(UserCollection).find();
  }
  
}

export const userCollectionService = new UserCollectionService();
