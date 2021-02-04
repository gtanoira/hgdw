import { Request, Response } from 'express';

// Models
import { localPriceToResponse, ProductLocalPrice } from '../models/product-local-price.model';

// Services
import { productLocalPricesService } from '../services/product-local-prices.service';
import { authorizationService } from '../services/authorization.service';
import { UpdateResult } from 'typeorm';

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

  // Obtener todos los registros
  public async update(req: Request, res: Response): Promise<UpdateResult | any> {
    // Obtener los query parameters si es que enviaron
    const id = req.params.id;
    if (id) {

      // Actualizar el registro
      const newLocalPrice = req.body;
      if (req.body.constructor === Object && Object.keys(req.body).length !== 0) {
        try {
          const newProduct: ProductLocalPrice = newLocalPrice;
          await productLocalPricesService.updateRecord(newProduct)
          .then(prices => {
            return res.status(200).send(prices);
          })
          .catch(error => {
            return res.status(503).send({
              'message': `Error al grabar los datos en la BDatos: ${error}`
            });
          })
          
        } catch (error) {
          return res.status(400).send({
            'message': 'Los datos enviados para actualizar son incorrectos o faltan (el body está mal formado)'
          });
        }
      } else {
        return res.status(400).send({
          'message': 'Faltan los datos a actualizar (el body está vacío)'
        });
      }

    } else {
      return res.status(400).send({
        'message': 'No se ha especificado qué registro actualizar (el id es nulo)'
      });
    }

  }
  

}

export const productLocalPricesController = new ProductLocalPricesController();


