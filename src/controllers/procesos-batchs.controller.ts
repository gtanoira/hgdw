import { Request, Response } from 'express';

// Models
import { ProcesoBatch } from '../models/proceso_batch.model';

// Services
import { procesosBatchsService } from '../services/procesos_batchs.service';
import { authorizationService } from '../services/authorization.service';

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
    console.log('*** Authorization:', req.headers);
    
    // Validar que el request tenga un token de un usuario válido
    if ( await authorizationService.isTokenValid(req.headers.authorization)) {
      const recs = await procesosBatchsService.getAll();
      return res.status(200).send(recs);
    } else {
      return res.status(401).send({ 'message': 'HTG-003(E): el token del usuario es inválido o ha expirado. Vuelva a loguearse.'})
    }
  }

}

export const procesosBatchsController = new ProcesosBatchsController();


