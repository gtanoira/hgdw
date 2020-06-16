import 'reflect-metadata';
import { ApiServer } from './server/index';
import { HotGoDBase } from './database/index';

// Abrir las conexiones con las bases de datos
HotGoDBase.setConnections();

// Definir al server
const server = new ApiServer();
server.start(+process.env.PORT || 5000);

