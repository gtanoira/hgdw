import { Router, NextFunction } from 'express';
import { procesosBatchsController } from '../controllers/procesos-batchs.controller';
import * as cors from 'cors';

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