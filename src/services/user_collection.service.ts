import { getConnection } from 'typeorm';

// Models
import { PaymentCommit } from '../models/payment_commit.model';
import { UserCollection } from '../models/user_collection.model';

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
