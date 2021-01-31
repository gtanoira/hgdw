import { Request, Response } from 'express';

// Models

// Services
import { authorizationService } from '../services/authorization.service';
import { countriesService } from '../services/countries.service';

class CountriesController {

  public async index(req: Request, res: Response): Promise<Response> {
    
    // Validar que el request tenga un token de un usuario válido
    if ( await authorizationService.isTokenValid(req.headers.authorization || '')) {
      return await countriesService.getAll()
        .then( data => {
          return res.status(200).send(data);
        })
        .catch(
          err => {
            console.log('*** ERR:', err);
            return res.status(503).send(err);
        });
    } else {

      return res.status(401).send({ 'message': 'HTG-003(E): el token del usuario es inválido o ha expirado. Vuelva a loguearse.'})
    }
  }

}
export const countriesController = new CountriesController();


