import { Request, Response } from 'express';

// Models

// Services
import { authorizationService } from '../services/authorization.service';
import { excelExporterService } from '../services/excel-exporter.service';
import { googleAnalyticsService } from '../services/google-analytics.service';

class GoogleAnalyticsController {

  // Leer todos los registros
  public async index(req: Request, res: Response): Promise<Response> {
    
    // Validar que el request tenga un token de un usuario válido
    return await googleAnalyticsService.getView4('', '', '', '')
    .then( rtnValue => {
      excelExporterService.exportAsExcelFile(rtnValue.rows, 'GA_cobros_');
      const a = [
        {
          "user":"AR_hotgo_19571545",
          "ttsId":"20201020064146AR_hotgo_19571545",
          "pais":"AR",
          "medioPago":"Tarjeta de Crédito",
          "moneda":"ARS",
          "importe":"3.868141"
        }, {      
          "user":"AR_hotgo_22043653",
          "ttsId":"20201015042525AR_hotgo_22043653",
          "pais":"AR",
          "medioPago":"Tarjeta de Crédito",
          "moneda":"ARS",
          "importe":"12.785305"
        }
      ];  
      excelExporterService.exportAsExcelFile(a, 'GA_cobros_');

      return res.send(rtnValue).status(200);
    })
    .catch( err => {
      console.log('*** ERROR CONTOLLER:');
      console.log(err, typeof err);
      return res.send(err.error.message.toString());  //.status(err.code.toString());
    });
  }

  // Leer todos los registros
  public async getData(req: Request, res: Response): Promise<Response> {

    // Validar que el request tenga un token de un usuario válido
    if ( await authorizationService.isTokenValid(req.headers.authorization || '')) {

      console.log('*** REQ.QUERY:', req.query);
      const metrics = req.query.metrics ? req.query.metrics.toString() : '';
      const dimensions = req.query.dimensions ? req.query.dimensions.toString() : '';
      const fechaDesde = req.query.fechadesde ? req.query.fechadesde.toString() : '';
      const fechaHasta = req.query.fechahasta ? req.query.fechahasta.toString() : '';
      
      // Validar que el request tenga un token de un usuario válido
      return await googleAnalyticsService.getView4(metrics, dimensions, fechaDesde, fechaHasta)
      .then( rtnValue => {
        return res.status(200).send(rtnValue);
      })
      .catch( err => {
        console.log('*** ERROR CONTOLLER:');
        console.log(err);
        return res.status(500).send({message: err.toString()});  //.status(err.code.toString());
      });
      
    } else {
      return res.status(401).send({ message: 'HTG-003(E): el token del usuario es inválido o ha expirado. Vuelva a loguearse.'})
    }
  }

}
export const googleAnalyticsController = new GoogleAnalyticsController();


