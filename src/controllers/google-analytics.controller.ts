import { Request, Response } from 'express';

// Models

// Services
import { googleAnalyticsService } from '../services/google-analytics.service';

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
      console.log(err, err.code);
      return res.send(err.errors).status(err.code);
    });
  }

}
export const googleAnalyticsController = new GoogleAnalyticsController();


