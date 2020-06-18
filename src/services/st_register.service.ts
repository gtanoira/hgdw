import { getConnection, Connection } from 'typeorm';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

// Models
import { StRegister } from '../models/st_register.model';
import { UserCache } from '../models/user_cache.model';

export class StRegisterService {

  // Cache's
  private usersCache: UserCache[];

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
    const connection = getConnection('DWHBP');
    return await connection.getRepository(StRegister).findOne(id);
  }
  
  public async getByUserId(userId: string): Promise<StRegister> {
    const connection = getConnection('DWHBP');
    return await connection.getRepository(StRegister).findOne({ userId: userId});
  }

  /*
   *  Rutinas para CACHE
   */
  public async getUserIdActualizar(userId: string): Promise<UserCache> {
    // Verificar que se haya cacheado los paises
    if (!this.usersCache) {
      await this.getPaisesCache()
        .then( data => { this.usersCache = data; console.log('*** usersCache:', this.usersCache.length); })
        .catch( err => console.log('*** UserCache Error:', err));
    }
    return this.usersCache.find( registro => registro.userId === userId);
  }
    
  private async getPaisesCache(): Promise<UserCache[]> {
    // return await connection.getRepository(StRegister)
    return getConnection('DWHBP').getRepository(StRegister)
      .createQueryBuilder()
      .getMany();
      /* .then( data => data.map( el => { 
        return {
          id: el.id,
          userId: el.userId,
          country: el.country,
          idpId: el.idpId
        }
      })); */
  }
}

export const stRegisterService = new StRegisterService();
