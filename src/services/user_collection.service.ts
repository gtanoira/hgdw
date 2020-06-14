import { Connection } from 'typeorm';

// Models
import { UserCollectionModel } from '../models/user_collection.model';

// Databases
import { HotGoDWHBPProvider } from '../database/index';

export class UserCollectionService {

  public async actualizar(): Promise<{}> {
    const connection = await HotGoDWHBPProvider.getConnection();
    return await connection.getRepository(UserCollectionModel).save(userCollection);
  }
  
  public async create(userCollection: UserCollectionModel): Promise<UserCollectionModel> {
    const connection = await HotGoDWHBPProvider.getConnection();
    return await connection.getRepository(UserCollectionModel).save(userCollection);
  }

  public async list(): Promise<UserCollectionModel[]> {  
    const connection = await HotGoDWHBPProvider.getConnection();
    return await connection.getRepository(UserCollectionModel).find();
  }
}

export const userCollectionService = new UserCollectionService();
