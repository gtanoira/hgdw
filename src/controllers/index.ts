// Controllers
import { PaymentCommitController } from './payment_commit.controller';
import { PingController } from './ping.controller';
import { ProcesoBatchController } from './proceso_batch.controller';
import { UserCollectionController } from './user_collection.controller';

export const CONTROLLERS = [
  new PaymentCommitController,
  new ProcesoBatchController(),
  new PingController(),
  new UserCollectionController()
];
