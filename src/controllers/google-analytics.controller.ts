import { Request, Response } from 'express';

// Models

// Services
import { googleAnalyticsService } from '../services/google-analytics.service';

class GoogleAnalyticsController {

  // Leer todos los registros
  public async index(req: Request, res: Response): Promise<any> {
    
    // Validar que el request tenga un token de un usuario válido
    await googleAnalyticsService.getView3()
    .then( rtnValue => {
      console.log('*** rtnValue:');
      console.log(rtnValue);
      return res.send(rtnValue).status(200);
    })
    .catch(err => {
      res.send(err).status(555);
    });
  }

}
export const googleAnalyticsController = new GoogleAnalyticsController();


