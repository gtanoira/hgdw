import { Router } from 'express';
import cors from 'cors';

// Controllers
import { paymentMethodsController } from '../controllers/payment_methods.controller';

export class PaymentMethodsRoute {

  // Inicializar el router
  public router: Router = Router();
   
  constructor() {
    this.config();
  }
  
  config(): void {
    this.router.get('/', cors(), paymentMethodsController.index);
  }

}
export const paymentMethodsRoute = new PaymentMethodsRoute();