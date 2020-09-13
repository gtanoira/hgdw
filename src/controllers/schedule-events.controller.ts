import { Request, Response } from 'express';

// Models

// Services
import { authorizationService } from '../services/authorization.service';
import { scheduleEventsService } from '../services/schedule-events.service';

class ScheduleEventsController {

  // Leer todos los registros
  public async index(req: Request, res: Response): Promise<Response> {
    
    // Validar que el request tenga un token de un usuario válido
    if ( await authorizationService.isTokenValid(req.headers.authorization || '')) {
      return await scheduleEventsService.getAll()
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

  // Modificar el schedule de un evento
  public async patch(req: Request, res: Response): Promise<Response> {
    // Validar que el request tenga un token de un usuario válido
    if ( await authorizationService.isTokenValid(req.headers.authorization || '')) {
      console.log('*** BODY:', req.body);
      const eventName = req.body.eventId;
      const intervalValue = +req.body.intervalValue;
      const intervalTime = req.body.intervalTime;
      return await scheduleEventsService.patchEvent(eventName, intervalValue, intervalTime)
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
export const scheduleEventsController = new ScheduleEventsController();


