import { Connection, createConnection, getConnectionOptions, ConnectionOptions } from 'typeorm';

// Models
import { ProcesosBatch } from '../models/proceso_batch.model';
import { PaymentCommit } from '../models/payment_commit.model';
import { UserCollectionModel } from '../models/user_collection.model';

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
  private static connection: Connection;
  private static connectionOptions: ConnectionOptions;

  public static async setConnection(dbSchemaName: string): Promise<Connection> {

    // Si la conexión existe, devolverla y no hacer nada más
    if (this.connection) {
      if (this.connection.name === dbSchemaName) {
        return this.connection;
      } else {
        // Cerrar la conexión anterior
        this.connection.close();
      }
    }

    // Customizar la conección a HotGo DB
    try {
      this.connectionOptions = await getConnectionOptions(dbSchemaName);  // leer las opciones desde ormconfig.json

      // Si no existe las credenciales para conectarse a la BDatos, emitir un error
      if (!this.connectionOptions) {
        throw new Error(`Las credenciales para la BDatos HotGo (schema: ${dbSchemaName}) no existen.`);
      }

      // Customizar
      if (dbSchemaName === 'Datalake') {
        Object.assign(this.connectionOptions, {
          entities: [
            PaymentCommit
          ]
        });
      };
      if (dbSchemaName === 'DWHBP') {
        Object.assign(this.connectionOptions, {
          entities: [
            ProcesosBatch
          ]
        });
        // namingStrategy: new MyNamingStrategy()
      };

      // create a connection using modified connection options
      this.connection = await createConnection(this.connectionOptions);
    } catch (err) {
      console.log('*** CONNECTION ERROR:', err);
    } finally {
      return this.connection;
    }
  }
}
