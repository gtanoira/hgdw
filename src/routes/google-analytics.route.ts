import { Router } from 'express';
import cors from 'cors';

// Controllers
import { googleAnalyticsController } from '../controllers/google-analytics.controller';

export class GoogleAnalyticsRoute {

  // Inicializar el router
  public router: Router = Router();
   
  constructor() {
    this.config();
  }
  
  config(): void {
    this.router.get('/view', cors(), googleAnalyticsController.index);
    this.router.get('/data', cors(), googleAnalyticsController.getData);
  }

}
export const googleAnalyticsRoute = new GoogleAnalyticsRoute();