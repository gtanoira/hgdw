import { getConnection } from "typeorm";
import * as moment from 'moment';

// Models
import { Pais } from "../models/paises.model";

// Convierte un UTC datetime a la zona horaria del país elegido
export async function ToTimeZone(datetimeUtc: string, country: string): Promise<String> {

  try {
    const connection = getConnection('DWHBP');
    const pais = await connection.getRepository(Pais).findOne({paisId: country.toUpperCase()});
    return moment(datetimeUtc, 'YYYY-MM-DDThh:mm:ss').add(pais.utcShift, 'hours').format('YYYY-MM-DDThh:mm:ss');
  
  } catch (error) {
    console.log('*** TO_TIME_ZONE:')
    console.log(error);
    return null;
  }
}