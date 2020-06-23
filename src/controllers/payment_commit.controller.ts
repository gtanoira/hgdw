import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { Request, Response } from 'restify';

// Models

// Services
import { paymentCommitService } from '../services/payment_commit.service';

export class PaymentCommitController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.get('/payment_commit/actualizar/:user', this.actualizar.bind(this));
  }

  private async actualizar(req: Request, res: Response): Promise<any> {
    return res.send( await paymentCommitService.actualizar(req.params.user) );
  }

}
