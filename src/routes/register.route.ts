import { Router } from 'express';
import cors from 'cors';

// Controllers
import { registerController } from '../controllers/register.controller';

export class RegisterRoute {

  // Inicializar el router
  public router: Router = Router();
   
  constructor() {
    this.config();
  }
  
  config(): void {
    this.router.patch('/del_duplicates', cors(), registerController.delDuplicateRegister);
    this.router.get('/history', cors(), registerController.InsertHistory);
    this.router.post('/missing', cors(), registerController.InsertMissingRegister);
  }

}
export const registerRoute = new RegisterRoute();