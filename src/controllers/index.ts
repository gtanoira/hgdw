// Controllers
import { PaymentCommitController } from './payment_commit.controller';
import { PingController } from './ping.controller';
import { ProcesoBatchController } from './proceso_batch.controller';
import { RebillController } from './rebill.controller';
import { StRegisterController } from './st_register.controller';
import { UserCollectionController } from './user_collection.controller';

export const CONTROLLERS = [
  new PaymentCommitController,
  new PingController(),
  new ProcesoBatchController(),
  new RebillController(),
  new StRegisterController(),
  new UserCollectionController()
];
