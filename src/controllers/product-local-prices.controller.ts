import { Request, Response } from 'express';

// Models
import { localPriceToResponse, ProductLocalPrice } from '../models/product-local-price.model';

// Services
import { productLocalPricesService } from '../services/product-local-prices.service';
import { authorizationService } from '../services/authorization.service';

class ProductLocalPricesController {

  /* // Borrar un lote y todos sus posteriores
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
  } */

  // Obtener todos los registros
  public async index(req: Request, res: Response): Promise<Response> {
    // Obtener los query parameters si es que enviaron
    const duration = req.query.duration?.toString();
    const pageNo = req.query.page_no?.toString();
    const recsPage = req.query.recs_page?.toString();
    const sortField = req.query.sort_field?.toString();
    const sortDirection = req.query.sort_direction?.toString();
    // Validar que el request tenga un token de un usuario válido
    if ( await authorizationService.isTokenValid(req.headers.authorization || '')) {
      let recs: ProductLocalPrice[] = [];
      await productLocalPricesService.getAll({
        duration: duration ? duration : '',
        pageNo: pageNo && +pageNo > 0 ? +pageNo : 1,
        recsPage: recsPage && +recsPage > 0 ? +recsPage : 10000,
        sortField: sortField ? sortField : '',
        sortDirection: sortDirection && 'asc,desc'.indexOf(sortDirection.toLowerCase()) >= 0 ? sortDirection : 'ASC'
      }).then(prices => {
        recs = prices.map(price => localPriceToResponse(price))
      });
      return res.status(200).send(recs);
    } else {
      return res.status(401).send({ 'message': 'HTG-003(E): el token del usuario es inválido o ha expirado. Vuelva a loguearse.'})
    }
  }

}

export const productLocalPricesController = new ProductLocalPricesController();


