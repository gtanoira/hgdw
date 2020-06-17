import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { Request, Response } from 'restify';

// Models
import { StRegister } from '../models/st_register.model';

// Services
import { stRegisterService } from '../services/st_register.service';

export class StRegisterController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.get('/st_register', this.list.bind(this));
    httpServer.get('/st_register/:id', this.getById.bind(this));
    httpServer.get('/st_register/user/:userId', this.getByUserId.bind(this));
  }

  private async list(req: Request, res: Response): Promise<StRegister[]> {
    const recs = await stRegisterService.list();
    return res.send(recs);
  }

  private async getById(req: Request, res: Response): Promise<void> {
    const data = await stRegisterService.getById(req.params.id);
    res.send(data ? 200 : 404, data);
  }
  
  private async getByUserId(req: Request, res: Response): Promise<void> {
    const data = await stRegisterService.getByUserId(req.params.userId);
    res.send(data ? 200 : 404, data);
  }

}
