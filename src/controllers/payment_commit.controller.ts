import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { Request, Response } from 'restify';

// Models
import { PaymentCommit } from '../models/payment_commit.model';

// Services
import { paymentCommitService } from '../services/payment_commit.service';
import { getConnection } from 'typeorm';

export class PaymentCommitController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.get('/payment_commit', this.list.bind(this));  
    httpServer.get('/payment_commit/new/:ultimoId', this.listNew.bind(this));
    httpServer.get('/payment_commit/actualizar/:user', this.actualizar.bind(this));
  }

  private async actualizar(req: Request, res: Response): Promise<any> {
    return res.send(
      await getConnection('DWHBP').query(`CALL pr_update_payment_commit('${req.params.user}')`)
    );
  }

  private async list(req: Request, res: Response): Promise<PaymentCommit[]> {
    return res.send(await paymentCommitService.list());
  }
  
  private async listNew(req: Request, res: Response): Promise<PaymentCommit[]> {
    return res.send(await paymentCommitService.listNew(req.params.ultimoId));
  }
}
