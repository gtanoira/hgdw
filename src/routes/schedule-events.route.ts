import { Router } from 'express';
import * as cors from 'cors';

// Controllers
import { scheduleEventsController } from '../controllers/schedule-events.controller';

export class ScheduleEventsRoute {

  // Inicializar el router
  public router: Router = Router();
   
  constructor() {
    this.config();
  }
  
  config(): void {
    this.router.get('/', cors(), scheduleEventsController.index);
  }

}
export const scheduleEventsRoute = new ScheduleEventsRoute();