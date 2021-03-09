import { Router } from 'express';

// Controllers
import { aliveController } from '../controllers/alive.controller';

export class AliveRoute {

  // Inicializar el router
  public router: Router = Router();
   
  constructor() {
    this.config();
  }
  
  config(): void {
    this.router.get('/', aliveController.showAlive);
  }

}
export const aliveRoute = new AliveRoute();