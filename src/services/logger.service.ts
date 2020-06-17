import { getConnection } from "typeorm";

// Settings
import { EMAILS_POR_ACTUALIZACON } from '../settings/email_server.settings';

// Models
import { ErrorLog } from "../models/error_logs.model";

export class LoggerService {

  public crearLogActualizar(errMessage: string): void {

    try {
      // Guardar en la base de datos
      const connection = getConnection('DWHBP');
      const errorRec = new ErrorLog();
      errorRec.errorType = 'actualizar tabla';
      errorRec.message = errMessage;
      connection.getRepository(ErrorLog).save(errorRec);

      // Enviar email
      /*
      emailService.sendMail(
        EMAILS_POR_ACTUALIZACION,
        'HotGo: error emitido por el sistema',
        `El sistema HotGo Backend ha generado el siguiente error:
         Tipo de error: ${errType}
         Mensaje:
         ${errMessage}
        `
      ); */
    } catch (error) {
      null;
    }
    return;
  }
}

export const loggerService = new LoggerService();