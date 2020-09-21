import { Router } from 'express';
import cors from 'cors';

// Controllers
import { cancelController } from '../controllers/cancel.controller';

export class CancelRoute {

  // Inicializar el router
  public router: Router = Router();
   
  constructor() {
    this.config();
  }
  
  config(): void {
    this.router.post('/history', cors(), cancelController.InsertCancelHistory);
    this.router.post('/missing', cors(), cancelController.InsertMissingCancel);
  }

}
export const cancelRoute = new CancelRoute();