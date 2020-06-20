import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { Request, Response } from 'restify';
import { getConnection } from 'typeorm';

// Models

// Services

export class PaymentCommitController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.get('/payment_commit/actualizar/:user', this.actualizar.bind(this));
  }

  private async actualizar(req: Request, res: Response): Promise<any> {
    return res.send(
      await getConnection('DWHBP').query(`CALL pr_update_payment_commit('${req.params.user}')`)
    );
  }

}
