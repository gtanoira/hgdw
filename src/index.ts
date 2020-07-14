import 'reflect-metadata';
import { ApiServer } from './server/index';
import { HotGoDBase } from './database/index';

// Environment
import { SERVER_PORT } from './settings/environment.settings';

// Abrir las conexiones con las bases de datos
HotGoDBase.setConnections();

// Definir al server
const server = new ApiServer();
// Arrancar el server
server.start(SERVER_PORT);

