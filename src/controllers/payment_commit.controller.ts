import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { Request, Response } from 'restify';

// Models
import { PaymentCommit } from '../models/payment_commit.model';

// Services
import { paymentCommitService } from '../services/payment_commit.service';

export class PaymentCommitController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.get('/payment_commit', this.list.bind(this));  
    httpServer.get('/payment_commit/new/:ultimoId', this.listNew.bind(this));
  }

  private async list(req: Request, res: Response): Promise<PaymentCommit[]> {
    return res.send(await paymentCommitService.list());
  }
  
  private async listNew(req: Request, res: Response): Promise<PaymentCommit[]> {
    return res.send(await paymentCommitService.listNew(req.params.ultimoId));
  }

}
