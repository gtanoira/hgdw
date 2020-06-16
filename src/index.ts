import 'reflect-metadata';
import { ApiServer } from './server/index';

// Definir al server
const server = new ApiServer();
server.start(+process.env.PORT || 5000);
