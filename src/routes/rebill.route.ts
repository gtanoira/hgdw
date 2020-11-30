import { Router } from 'express';
import cors from 'cors';

// Controllers
import { rebillController } from '../controllers/rebill.controller';

export class RebillRoute {

  // Inicializar el router
  public router: Router = Router();
   
  constructor() {
    this.config();
  }
  
  config(): void {
    this.router.post('/missing', cors(), rebillController.InsertMissingRebill);
  }

}
export const rebillRoute = new RebillRoute();