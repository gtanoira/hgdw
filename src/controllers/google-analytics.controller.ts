import { Request, Response } from 'express';

// Models & Interfaces
// Services
import { authorizationService } from '../services/authorization.service';
import { errorLogsService } from '../services/error-logs.service';
import { excelExporterService } from '../services/excel-exporter.service';
import { googleAnalyticsService } from '../services/google-analytics.service';

class GoogleAnalyticsController {

  // Leer y grabar en el AWS MySql la 1er.sesion de nuevos usuarios por dia
  public async daily1stUserSession(req: Request, res: Response): Promise<any> {
    
    // Este header en el Request es enviado por una rutina en Java dentro del server Linux
    // que es la encargada de procesar diariamente esta API via un CRONTAB del linux.
    // Si existe este header, se bypasea la validación del token
    const bypassAuths = req.headers['x-token-hgdw'] === 'BYPASS' ? true : false;

    // Validar que el request tenga un token de un usuario válido
    if ( bypassAuths || await authorizationService.isTokenValid(req.headers.authorization || '')) {

      // Leer query paramters
      const fechaDesde = req.query.fechadesde ? req.query.fechadesde.toString() : '';
      const fechaHasta = req.query.fechahasta ? req.query.fechahasta.toString() : '';
      // Generar los parámetros para la llamada al GA
      const dimensions = 'ga:dimension1,ga:dateHourMinute, ga:channelgrouping,ga:source,ga:medium ,ga:campaign,ga:adContent';
      const metrics = 'ga:sessions';
      const filters = 'ga:newUsers==1';
      let pageIndex = 1;
      let recordsSaved = 0;
      
      // Obtener los datos de GA en páginas de 10000 registros
      let isMore = true;
      while (isMore) {
        await googleAnalyticsService.getView4(metrics, dimensions, fechaDesde, fechaHasta, filters, pageIndex)
        .then( async rtnValue => {
          if (rtnValue.rows) {
            const users1stsessions: [] = rtnValue.rows;
            await googleAnalyticsService.save1stSessionsToMySql(users1stsessions)
            .then(data => { recordsSaved = recordsSaved + data })
            .catch(error => {
              // Guardar el error de la operación en Error_logs
              errorLogsService.addError('GA_users_1st_sessions', error.message.toString(), 'nocode', 0);
              return res.status(503).send(error);
            });
            isMore = (rtnValue.nextLink) ? true : false;
            pageIndex += 1;
          } else {
            isMore = false;
          }
        })
        .catch( err => {
          console.log('*** ERROR FROM GA:');
          console.log(err);
          return res.status(503).send({message: err.message.toString()});  //.status(err.code.toString());
        });
      }
      console.log(`*** Fin daily1stUserSession(de ${fechaDesde} a ${fechaHasta}), registros grabados: ${recordsSaved}`);
      return res.status(200).send({ message: `Proceso finalizado OK. Registros grabados: ${recordsSaved}`});
      
    } else {
      return res.status(401).send({ message: 'HTG-003(E): el token del usuario es inválido o ha expirado. Vuelva a loguearse.'})
    }
  }

  // Leer todos los registros
  public async getData(req: Request, res: Response): Promise<Response> {

    // Validar que el request tenga un token de un usuario válido
    if ( await authorizationService.isTokenValid(req.headers.authorization || '')) {

      // console.log('*** REQ.QUERY:', req.query);
      const metrics = req.query.metrics ? req.query.metrics.toString() : '';
      const dimensions = req.query.dimensions ? req.query.dimensions.toString() : '';
      const fechaDesde = req.query.fechadesde ? req.query.fechadesde.toString() : '';
      const fechaHasta = req.query.fechahasta ? req.query.fechahasta.toString() : '';
      const filters = req.query.filters ? req.query.filters.toString() : '';
      const pageIndex = req.query.pageindex ? +req.query.pageindex : 1;
      
      return await googleAnalyticsService.getView4(metrics, dimensions, fechaDesde, fechaHasta, filters, pageIndex)
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

  // Leer todos los registros
  public async index(req: Request, res: Response): Promise<Response> {
    
    // Validar que el request tenga un token de un usuario válido
    return await googleAnalyticsService.getView4('', '', '', '', '')
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

}
export const googleAnalyticsController = new GoogleAnalyticsController();


