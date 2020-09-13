import { Request, Response } from 'express';

// Models

// Services
import { procesosBatchsService } from '../services/procesos_batchs.service';
import { authorizationService } from '../services/authorization.service';

class ProcesosBatchsController {

  // Borrar un lote y todos sus posteriores
  public async delete(req: Request, res: Response): Promise<Response> {
    let rtnStatus = 444;
    let rtnMessage = 'No hay nada';
    await procesosBatchsService.delById(+req.params.id)
      .then(
        data => {
          const aux = JSON.parse(data);
          rtnStatus = aux.status;
          rtnMessage = aux;
        }
      )
      .catch(
        err => {
          rtnStatus = 503;
          rtnMessage = err;
        }
      );
    return res.send(rtnMessage).status(rtnStatus);
  }

  // Obtener todos los registros
  public async index(req: Request, res: Response): Promise<Response> {
    // Validar que el request tenga un token de un usuario válido
    if ( await authorizationService.isTokenValid(req.headers.authorization || '')) {
      const recs = await procesosBatchsService.getAll();
      return res.status(200).send(recs);
    } else {
      return res.status(401).send({ 'message': 'HTG-003(E): el token del usuario es inválido o ha expirado. Vuelva a loguearse.'})
    }
  }

}

export const procesosBatchsController = new ProcesosBatchsController();


