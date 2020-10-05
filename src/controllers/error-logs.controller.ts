import { Request, Response } from 'express';

// Models

// Services
import { authorizationService } from '../services/authorization.service';
import { errorLogsService } from '../services/error-logs.service';

class ErrorLogsController {

  public async index(req: Request, res: Response): Promise<Response> {
    
    // Validar que el request tenga un token de un usuario válido
    if ( await authorizationService.isTokenValid(req.headers.authorization || '')) {
      return await errorLogsService.getAll()
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

  // Cheuqar si los errores se han solucionado y actualizar la tabla error_logs
  public async check(req: Request, res: Response): Promise<Response> {
    // Validar que el request tenga un token de un usuario válido
    if ( await authorizationService.isTokenValid(req.headers.authorization || '')) {

      return await errorLogsService.checkErrors(req.params.userId)
        .then( data => {
          console.log(data);
          return res.status(200).send({message: 'Chequeo de errores finalizado con éxito.'});
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
export const errorLogsController = new ErrorLogsController();


