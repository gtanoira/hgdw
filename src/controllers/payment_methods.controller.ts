import { Request, Response } from 'express';

// Models
import { paymentMethodToResponse, PaymentMethod } from '../models/payment_method.model';

// Services
import { paymentMethodsService } from '../services/payment_methods.service';
import { authorizationService } from '../services/authorization.service';

class PaymentMethodsController {

  // Obtener todos los registros
  public async index(req: Request, res: Response): Promise<Response> {
    // Obtener los query parameters si es que enviaron
    const country = req.query.country?.toString();
    const pageNo = req.query.page_no?.toString();
    const recsPage = req.query.recs_page?.toString();
    const sortField = req.query.sort_field?.toString();
    const sortDirection = req.query.sort_direction?.toString();
    
    // Validar que el request tenga un token de un usuario válido
    if ( await authorizationService.isTokenValid(req.headers.authorization || '')) {
      let recs: PaymentMethod[] = [];
      await paymentMethodsService.getRecords({
        country: country ? country : '',
        pageNo: pageNo && +pageNo > 0 ? +pageNo : 1,
        recsPage: recsPage && +recsPage > 0 ? +recsPage : 10000,
        sortField: sortField ? sortField : '',
        sortDirection: sortDirection && 'asc,desc'.indexOf(sortDirection.toLowerCase()) >= 0 ? sortDirection : 'ASC'
      }).then(data => {
        recs = data.map(el => paymentMethodToResponse(el))
      });
      return res.status(200).send(recs);
    } else {
      return res.status(401).send({ 'message': 'HTG-003(E): el token del usuario es inválido o ha expirado. Vuelva a loguearse.'})
    }
  }
}

export const paymentMethodsController = new PaymentMethodsController();


