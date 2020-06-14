import 'reflect-metadata';
import { ApiServer } from './server/index';
import { HotGoDWHBPProvider, HotGoDatalakeProvider } from './database/index';

// Credenciales de la BDatos para acceder al schema: DWHBP
HotGoDWHBPProvider.configure({
  type: process.env.DATABASE_TYPE as any || 'mysql',
  database: 'DWHBP',
  username: process.env.DATABASE_USERNAME || 'gtanoira',
  password: process.env.DATABASE_PASSWORD || 'Gtn.3617$',
  host: process.env.DATABASE_HOST || 'database-1.cdvbmjzc3qqe.us-east-1.rds.amazonaws.com',
  port: +process.env.DATABASE_PORT || 3306,
  ssl: !!process.env.USE_SSL
});

// Credenciales de la BDatos para acceder al schema: Datalake
HotGoDatalakeProvider.configure({
  type: process.env.DATABASE_TYPE as any || 'mysql',
  database: 'Datalake',
  username: process.env.DATABASE_USERNAME || 'gtanoira',
  password: process.env.DATABASE_PASSWORD || 'Gtn.3617$',
  host: process.env.DATABASE_HOST || 'database-1.cdvbmjzc3qqe.us-east-1.rds.amazonaws.com',
  port: +process.env.DATABASE_PORT || 3306,
  ssl: !!process.env.USE_SSL
});

// Definir al server
const server = new ApiServer();
server.start(+process.env.PORT || 5000);
