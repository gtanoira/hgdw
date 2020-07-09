import { Request, Response } from 'express';
import { DeleteResult } from 'typeorm';

// Models
import { ProcesoBatch } from '../models/proceso_batch.model';

// Services
import { procesosBatchsService } from '../services/procesos_batchs.service';

class ProcesosBatchsController {

  public async delete(req: Request, res: Response): Promise<any> {
    const data = await procesosBatchsService.delById(+req.params.id);
    return res.send(data).status(data ? 200 : 404);
  }

  /* private async edit(req: Request, res: Response): Promise<ProcesosBatch> {
    const data = await procesoBatchService.getById(req.params.id);
    return res.send(data ? 200 : 404, data);
  } */

  public async index(req: Request, res: Response): Promise<any> {
    const recs = await procesosBatchsService.getAll();
    return res.send(recs).status(200);
  }

}

export const procesosBatchsController = new ProcesosBatchsController();


