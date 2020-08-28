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
    this.router.get('/history', cors(), registerController.InsertHistory);
    this.router.patch('/del_duplicates', cors(), registerController.delDuplicateRegister);
  }

}
export const registerRoute = new RegisterRoute();