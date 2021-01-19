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
    this.router.get('/1st_user_session', cors(), googleAnalyticsController.daily1stUserSession);
    this.router.get('/daily_transactions', cors(), googleAnalyticsController.dailyTransactions);
  }

}
export const googleAnalyticsRoute = new GoogleAnalyticsRoute();