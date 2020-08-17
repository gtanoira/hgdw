import { Router } from 'express';
import cors from 'cors';

// Controllers
import { userCollectionsController } from '../controllers/user_collections.constroller';

export class UserCollectionsRoute {

  // Inicializar el router
  public router: Router = Router();
   
  constructor() {
    this.config();
  }
  
  config(): void {
    this.router.post('/payment_commit_history', cors(), userCollectionsController.InsertPaymentCommitHistory);
    this.router.post('/rebill_history', cors(), userCollectionsController.InsertRebillHistory);
  }

}
export const userCollectionsRoute = new UserCollectionsRoute();