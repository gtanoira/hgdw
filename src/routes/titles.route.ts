import { Router } from 'express';
import cors from 'cors';

// Controllers
import { titlesController } from '../controllers/titles.controller';

export class TitlesRoute {

  // Inicializar el router
  public router: Router = Router();
   
  constructor() {
    this.config();
  }
  
  config(): void {
    this.router.post('/publish', cors(), titlesController.publishTitles);
  }

}
export const titlesRoute = new TitlesRoute();