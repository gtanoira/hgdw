import { Router } from 'express';
import cors from 'cors';

// Controllers
import { errorLogsController } from '../controllers/error-logs.controller';

export class ErrorLogsRoute {

  // Inicializar el router
  public router: Router = Router();
   
  constructor() {
    this.config();
  }
  
  config(): void {
    this.router.get('/', cors(), errorLogsController.index);
  }

}
export const errorLogsRoute = new ErrorLogsRoute();