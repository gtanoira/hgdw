import { Request, Response } from 'express';

// Models

// Services
import { paisesService } from '../services/paises.service';
import { authorizationService } from '../services/authorization.service';

class PaisesController {

  // Obtener todos los registros
  public async index(req: Request, res: Response): Promise<Response> {
    // Validar que el request tenga un token de un usuario válido
    if ( await authorizationService.isTokenValid(req.headers.authorization || '')) {
      const recs = await paisesService.getAll();
      return res.status(200).send(recs);
    } else {
      return res.status(401).send({ 'message': 'HTG-003(E): el token del usuario es inválido o ha expirado. Vuelva a loguearse.'})
    }
  }

}

export const paisesController = new PaisesController();


