import { Connection, getConnectionOptions, ConnectionOptions, createConnections } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models
import { ErrorLog } from '../models/error-log.model';
import { FieldStatus } from '../models/field_status.model';
import { Country } from '../models/country.model';
import { ProcesoBatch } from '../models/proceso_batch.model';
import { ScheduleEvent } from '../models/schedule-event.model';

/* 
Ejemplo de la interfaz "ConnectionOptions"
export interface ConnectionOptions {
  type: 'postgres' | 'mysql' | 'mssql';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl?: boolean;
  charset?: string | 'UTF8_GENERAL_CI';
  timezone?: string | 'Z';
  supportBigNumbers?: boolean | true;
  entitites: [];
  migrationsRun?: boolean | false;
  synchronize?: boolean | false;
}
*/

// Base de datos HotGo 
export class HotGoDBase {
  public static connections: Connection[] | null;

  // Establecer todas las conexiones con las bases de datos
  public static async setConnections(): Promise<void> {

    // Customizar la conección a HotGo DB Datalake (la configuración de la BDatos se lee desde ormconfig.json)
    let connectionInformationSchemaOptions: ConnectionOptions = await getConnectionOptions('INFORMATION_SCHEMA')
    // Si no existe las credenciales para conectarse a Datalake, emitir un error
    if (!connectionInformationSchemaOptions) {
      throw new Error(`Las credenciales para la BDatos HotGo (schema: INFORMATION_SCHEMA) no existen.`);
    }
    // Customizar
    Object.assign(connectionInformationSchemaOptions, {
      entities: [
        ScheduleEvent
      ]
    });

    // Customizar la conección a HotGo DB AWS_DBASE
    const connectionAWS_DBASEOptions: ConnectionOptions = await getConnectionOptions(AWS_DBASE);  // leer las opciones desde ormconfig.json
    // Si no existe las credenciales para conectarse a Datalake, emitir un error
    if (!connectionAWS_DBASEOptions) {
      throw new Error(`Las credenciales para la BDatos HotGo (schema: ${AWS_DBASE}) no existen.`);
    }
    // Customizar
    Object.assign(connectionAWS_DBASEOptions, {
      entities: [
        ErrorLog,
        FieldStatus,
        Country,
        ProcesoBatch
      ]
    });

    // Crear las conexiones usando las opciones modificadas
    const options: ConnectionOptions[] = [];
    options.push(connectionAWS_DBASEOptions);
    options.push(connectionInformationSchemaOptions);
    this.connections = await createConnections(options)
    .then(
      connection => {
        return this.connections;
      },
    )
    .catch(
      error => {
        console.log('*** ERROR al iniciar las conecciones a las bases de datos');
        console.log(error);
        return null;
      }
    );
  }
}
