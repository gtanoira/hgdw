import { getConnection  } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models
import { Pais } from '../models/pais.model';

export class PaisesService {

  public async getAll():Promise<Pais[]> {
    const connection = getConnection(AWS_DBASE);
    return await connection.getRepository(Pais).find();
  }
}

export const paisesService = new PaisesService();
