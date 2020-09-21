import { Router } from 'express';
import cors from 'cors';

// Controllers
import { paymentCommitController } from '../controllers/payment_commit.controller';

export class PaymentCommitRoute {

  // Inicializar el router
  public router: Router = Router();
   
  constructor() {
    this.config();
  }
  
  config(): void {
    this.router.post('/missing', cors(), paymentCommitController.InsertMissingPyc);
  }

}
export const paymentCommitRoute = new PaymentCommitRoute();