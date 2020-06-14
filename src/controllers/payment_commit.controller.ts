import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { Request, Response } from 'restify';

// Models
import { PaymentCommitModel } from '../models/payment_commit.model';

// Services
import { paymentCommitService } from '../services/payment_commit.service';

export class PaymentCommitController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.get('/payment_commit', this.list.bind(this));
  }

  private async list(req: Request, res: Response): Promise<PaymentCommitModel[]> {
    return res.send(await paymentCommitService.list());
  }

}
