import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { Request, Response } from 'restify';

// Services
import { userCollectionService } from '../services/user_collection.service';

export class UserCollectionController implements Controller {

  // Establecer los ROUTES
  public initialize(httpServer: HttpServer): void {
    httpServer.get('/user_collection', this.list.bind(this));
  }
  
  private async list(req: Request, res: Response): Promise<void> {
    res.send(await userCollectionService.list());
  }

}
