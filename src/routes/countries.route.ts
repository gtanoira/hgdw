import { Router } from 'express';
import cors from 'cors';

// Controllers
import { countriesController } from '../controllers/countries.controller';

export class CountriesRoute {

  // Inicializar el router
  public router: Router = Router();
   
  constructor() {
    this.config();
  }
  
  config(): void {
    this.router.get('/', cors(), countriesController.index);
  }

}
export const countriesRoute = new CountriesRoute();