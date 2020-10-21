import { Router } from 'express';
import cors from 'cors';

// Controllers
import { productLocalPricesController } from '../controllers/product-local-prices.controller';

export class ProductLocalPricesRoute {

  // Inicializar el router
  public router: Router = Router();
   
  constructor() {
    this.config();
  }
  
  config(): void {
    this.router.get('/', cors(), productLocalPricesController.index);
    // this.router.delete('/:id', cors(), productLocalPricesController.delete);
  }

}
export const productLocalPricesRoute = new ProductLocalPricesRoute();