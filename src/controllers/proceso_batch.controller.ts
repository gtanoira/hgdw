import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { Request, Response } from 'restify';

// Models
import { ProcesosBatch } from '../models/proceso_batch.model';

// Services
import { procesoBatchService } from '../services/proceso_batch.service';

export class ProcesoBatchController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.get('/proceso_batch', this.list.bind(this));
    httpServer.get('/proceso_batch/:id', this.getById.bind(this));
  }

  private async list(req: Request, res: Response): Promise<ProcesosBatch[]> {
    const recs = await procesoBatchService.list();
    return res.send(recs);
  }

  private async getById(req: Request, res: Response): Promise<void> {
    const customer = await procesoBatchService.getById(req.params.id);
    res.send(customer ? 200 : 404, customer);
  }

}
