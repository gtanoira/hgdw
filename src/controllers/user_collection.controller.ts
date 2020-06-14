import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { Request, Response } from 'restify';

// Models

// Services
import { userCollectionService } from '../services/user_collection.service';

export class UserCollectionController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.post('/user_collection/actualizar', this.actualizar.bind(this));
  }

  private async actualizar(req: Request, res: Response): Promise<void> {
    res.send(await userCollectionService.actualizar());
  }

}
