import { Request, Response } from 'express';

// Models

// Services
import { googleAnalyticsService } from '../services/google-analytics.service';
import { type } from 'os';

class GoogleAnalyticsController {

  // Leer todos los registros
  public async index(req: Request, res: Response): Promise<any> {
    
    // Validar que el request tenga un token de un usuario válido
    await googleAnalyticsService.getView4()
    .then( rtnValue => {
      console.log('*** rtnValue:');
      console.log(rtnValue);
      return res.send(rtnValue).status(200);
    })
    .catch( err => {
      console.log('*** ERROR CONTOLLER:');
      console.log(err, typeof err);
      return res.send(err.error.message.toString());  //.status(err.code.toString());
    });
  }

}
export const googleAnalyticsController = new GoogleAnalyticsController();


