import { Router } from 'express';
import * as cors from 'cors';

// Controllers
import { procesosBatchsController } from '../controllers/procesos-batchs.controller';

export class ProcesosBatchsRoute {

  // Inicializar el router
  public router: Router = Router();
   
  constructor() {
    this.config();
  }
  
  config(): void {
    this.router.get('/', cors(), procesosBatchsController.index);
    this.router.delete('/:id', cors(), procesosBatchsController.delete);
  }

}
export const procesosBatchsRoute = new ProcesosBatchsRoute();