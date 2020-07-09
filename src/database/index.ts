import { Connection, getConnectionOptions, ConnectionOptions, createConnections } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models
import { ErrorLog } from '../models/error_logs.model';
import { FieldStatus } from '../models/field_status.model';
import { Pais } from '../models/paises.model';
import { ProcesoBatch } from '../models/proceso_batch.model';
import { PaymentCommit } from '../models/payment_commit.model';
import { Rebill } from '../models/rebill.model';
import { UserRegister } from '../models/user_register.model';
import { UserCollection } from '../models/user_collection.model';

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
  public static connections: Connection[];

  // Establecer todas las conexiones con las bases de datos
  public static async setConnections(): Promise<void> {

    // Customizar la conección a HotGo DB Datalake
    let connectionDatalakeOptions: ConnectionOptions = await getConnectionOptions('Datalake');  // leer las opciones desde ormconfig.json
    // Si no existe las credenciales para conectarse a Datalake, emitir un error
    if (!connectionDatalakeOptions) {
      throw new Error(`Las credenciales para la BDatos HotGo (schema: Datalake) no existen.`);
    }
    // Customizar
    Object.assign(connectionDatalakeOptions, {
      entities: [
        PaymentCommit,
        Rebill
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
        Pais,
        ProcesoBatch,
        UserRegister,
        UserCollection
      ]
    });

    // Crear las conexiones usando las opciones modificadas
    const options: ConnectionOptions[] = [];
    options.push(connectionAWS_DBASEOptions);
    options.push(connectionDatalakeOptions);
    this.connections = await createConnections(options)
    .then(
      connection => {
        console.log(`Database AWS.Datalake y AWS.${AWS_DBASE} iniciados`);
        return this.connections;
      },
    )
    .catch(
      error => {
        console.log('*** ERROR al iniciar las conecciones a las bases de datos');
        return null;
      }
    );
  }
}
