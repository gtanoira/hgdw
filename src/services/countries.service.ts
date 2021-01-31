import { getConnection } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models
import { Country } from '../models/country.model';

export class CountriesService {

  public async getAll():Promise<Country[]> {
    const connection = getConnection(AWS_DBASE);
    return await connection.getRepository(Country).find();
  }
}
export const countriesService = new CountriesService();
