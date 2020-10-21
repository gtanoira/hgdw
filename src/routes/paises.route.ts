import { Router } from 'express';
import cors from 'cors';

// Controllers
import { paisesController } from '../controllers/paises.controller';

export class PaisesRoute {

  // Inicializar el router
  public router: Router = Router();
   
  constructor() {
    this.config();
  }
  
  config(): void {
    this.router.get('/', cors(), paisesController.index);
  }

}
export const paisesRoute = new PaisesRoute();