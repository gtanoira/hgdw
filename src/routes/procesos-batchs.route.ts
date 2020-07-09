import { Router } from 'express';
import { procesosBatchsController } from '../controllers/procesos-batchs.controller';

export class ProcesosBatchsRoute {

  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get('/', procesosBatchsController.index);
    this.router.delete('/:id', procesosBatchsController.delete);
  }

}

export const procesosBatchsRoute = new ProcesosBatchsRoute();