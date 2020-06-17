import { Connection, getConnectionOptions, ConnectionOptions, createConnections } from 'typeorm';

// Models
import { ErrorLog } from '../models/error_logs.model';
import { FieldStatus } from '../models/field_status.model';
import { Pais } from '../models/paises.model';
import { ProcesosBatch } from '../models/proceso_batch.model';
import { PaymentCommit } from '../models/payment_commit.model';
import { StRegister } from '../models/st_register.model';
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
        PaymentCommit
      ]
    });

    // Customizar la conección a HotGo DB DWHBP
    const connectionDWHBPOptions: ConnectionOptions = await getConnectionOptions('DWHBP');  // leer las opciones desde ormconfig.json
    // Si no existe las credenciales para conectarse a Datalake, emitir un error
    if (!connectionDWHBPOptions) {
      throw new Error(`Las credenciales para la BDatos HotGo (schema: DWHBP) no existen.`);
    }
    // Customizar
    Object.assign(connectionDWHBPOptions, {
      entities: [
        ErrorLog,
        FieldStatus,
        Pais,
        ProcesosBatch,
        StRegister,
        UserCollection
      ]
    });

    // Crear las conexiones usando las opciones modificadas
    const options: ConnectionOptions[] = [];
    options.push(connectionDWHBPOptions);
    options.push(connectionDatalakeOptions);
    this.connections = await createConnections(options);
    return;
  }
}
