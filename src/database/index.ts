import { Connection, createConnection } from 'typeorm';
import { Observable, of, from } from 'rxjs';

// Models
import { ProcesoBatchModel } from '../models/proceso_batch.model';

export interface DatabaseConfiguration {
  type: 'postgres' | 'mysql' | 'mssql';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl?: boolean;
}

export class HotGoAwsProvider {
  private static connection: Connection;
  private static configuration: DatabaseConfiguration;

  public static configure(databaseConfiguration: DatabaseConfiguration): void {
    HotGoAwsProvider.configuration = databaseConfiguration;
  }

  public static async getConnection(): Promise<Connection> {
    if (this.connection) {
      return this.connection;
    }

    if (!this.configuration) {
      throw new Error('HotGoAwsProvider is not configured yet.');
    }

    const { type, host, port, username, password, database, ssl } = HotGoAwsProvider.configuration;
    this.connection = await createConnection({
      type, host, port, username, password, database,
      extra: {
        ssl
      },
      entities: [
        ProcesoBatchModel
      ],
      autoSchemaSync: true
    } as any);// as any to prevent complaining about the object does not fit to MongoConfiguration, which we won't use here

    return this.connection;
    
  }
}
