import { getConnection, Connection } from 'typeorm';

// Models
import { StRegister } from '../models/st_register.model';

export class StRegisterService {

  public async list(): Promise<StRegister[]> {  
    try {
      const connection = getConnection('DWHBP');
      return await connection.getRepository(StRegister).find();
    } catch (error) {
      console.log('*** st_register.list:');
      console.log(error);
      return [];
    }
  }
  
  public async getById(id: number): Promise<StRegister> {
    try {
      const connection = getConnection('DWHBP');
      return await connection.getRepository(StRegister).findOne(id);
    } catch (error) {
      console.log('*** st_register.getById:', error);
      return null;
    }
  }
  
  public async getByUserId(userId: string): Promise<StRegister> {
    try {
      const connection = getConnection('DWHBP');
      return await connection.getRepository(StRegister).findOne({ userId: userId});
    } catch (error) {
      console.log('*** st_register.getByUserId:', error);
      return null;
    }
  }
}

export const stRegisterService = new StRegisterService();
