import { getConnection } from "typeorm";
import moment from 'moment';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models
import { Country } from "../models/country.model";

// Convierte un UTC datetime a la zona horaria del país elegido
export async function ToTimeZone(datetimeUtc: string, country: string): Promise<String | null> {

  try {
    const connection = getConnection(AWS_DBASE);
    const hsShift = await connection.getRepository(Country).findOne({paisId: country.toUpperCase()})
      .then( data => data ? data.utcShift : 0)
      .catch( error => 0 );
    return moment(datetimeUtc, 'YYYY-MM-DDThh:mm:ss').add(hsShift, 'hours').format('YYYY-MM-DDThh:mm:ss');
  
  } catch (error) {
    console.log(error);
    return null;
  }
}