import { ProcesoBatchController } from './proceso_batch.controller';
import { PingController } from './ping.controller';

export const CONTROLLERS = [
  new ProcesoBatchController(),
  new PingController()
];
