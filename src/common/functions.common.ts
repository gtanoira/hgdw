import { getConnection } from "typeorm";
import moment from 'moment';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models
import { Country } from "../models/country.model";

// Convierte un UTC datetime a la zona horaria del país elegido
export async function ToTimeZone(datetimeUtc: string, country: string): Promise<string | null> {

  try {
    const connection = getConnection(AWS_DBASE);
    const hsShift = await connection.getRepository(Country).findOne({country: country.toUpperCase()})
      .then( data => data ? data.utcShift : 0)
      .catch( () =>  0 );
    return moment(datetimeUtc, 'YYYY-MM-DDThh:mm:ss').add(hsShift, 'hours').format('YYYY-MM-DDThh:mm:ss');
  
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Convertir fecha de Excel a Typescript Date
export function getDateFromExcel(excelDate: number): Date {

  // JavaScript dates can be constructed by passing milliseconds
  // since the Unix epoch (January 1, 1970) example: new Date(12312512312);

  // 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1 (Google "excel leap year bug")             
  // 2. Convert to milliseconds.

  return new Date((excelDate - (25567 + 2))*86400*1000);

}