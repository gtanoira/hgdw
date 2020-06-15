import { Connection, createConnection } from 'typeorm';

// Models
import { ProcesoBatchModel } from '../models/proceso_batch.model';
import { PaymentCommitModel } from '../models/payment_commit.model';
import { UserCollectionModel } from '../models/user_collection.model';

export interface DatabaseConfiguration {
  type: 'postgres' | 'mysql' | 'mssql';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl?: boolean;
}

// Base de datos DWHBP 
export class HotGoDWHBPProvider {
  private static connection: Connection;
  private static configuration: DatabaseConfiguration;

  public static configure(databaseConfiguration: DatabaseConfiguration): void {
    this.configuration = databaseConfiguration;
  }

  public static async getConnection(): Promise<Connection> {
    if (this.connection) {
      return this.connection;
    }

    if (!this.configuration) {
      throw new Error('HotGoDWHBPProvider is not configured yet.');
    }

    const { type, host, port, username, password, database, ssl } = this.configuration;
    this.connection = await createConnection({
      type, host, port, username, password, // database,
      extra: {
        ssl
      },
      entities: [
        ProcesoBatchModel,
        UserCollectionModel
      ],
      migrationsRun: false,
      autoSchemaSync: true
    } as any);// as any to prevent complaining about the object does not fit to MongoConfiguration, which we won't use here

    return this.connection;
  }
}

// Base de datos Datalake
export class HotGoDatalakeProvider {
  private static connection: Connection;
  private static configuration: DatabaseConfiguration;

  public static configure(databaseConfiguration: DatabaseConfiguration): void {
    this.configuration = databaseConfiguration;
  }

  public static async getConnection(): Promise<Connection> {
    if (this.connection) {
      return this.connection;
    }

    if (!this.configuration) {
      throw new Error('HotGoDatalakeProvider is not configured yet.');
    }

    const { type, host, port, username, password, database, ssl } = this.configuration;
    this.connection = await createConnection({
      type, host, port, username, password, database,
      extra: {
        ssl
      },
      entities: [
        PaymentCommitModel
      ],
      migrationsRun: false,
      autoSchemaSync: true
    } as any);// as any to prevent complaining about the object does not fit to MongoConfiguration, which we won't use here

    return this.connection;
    
  }
}

