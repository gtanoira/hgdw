import { Controller } from './controller';
import { getConnection, Connection, InsertResult } from 'typeorm';
import { HttpServer } from '../server/httpServer';
import { Request, Response } from 'restify';

// External libraries
const axios = require('axios').default;

// Librerías externas
import * as moment from 'moment';

// Common Functions
import { ToTimeZone } from '../common/functions.common';

// Settings
import { SAPGW_SERVER } from '../settings/sapgw_server.settings';

// Models
import { PaymentCommit } from '../models/payment_commit.model';
import { ProcesosBatch } from '../models/proceso_batch.model';
import { StRegister } from '../models/st_register.model';

// Services
import { auxiliarTablesService } from '../services/auxiliar_tables.service';
import { loggerService } from '../services/logger.service';
import { paymentCommitService } from '../services/payment_commit.service';
import { stRegisterService } from '../services/st_register.service';
import { userCollectionService } from '../services/user_collection.service';
import { UserCollection } from '../models/user_collection.model';

export class UserCollectionController implements Controller {

  // Establecer los ROUTES
  public initialize(httpServer: HttpServer): void {
    httpServer.get('/user_collection', this.list.bind(this));
    httpServer.post('/user_collection/actualizar', this.actualizar.bind(this));
  }

  /*
   * Actualizar la tabla USER_COLLECTION
   * Esta tabla se alimenta de 2 tablas: la payment_commit y la rebill.
   * Ambas tablas se encuentran dentro del schema Datalake.
  */
  private async actualizar(req: Request, res: Response): Promise<{}> {

    // Actualizar desde la payment_commit
    console.log('***');
    console.log('*** INICIO');
    const rtnMessage = await this.actualizarDesdePaymentCommit();
    console.log('*** FIN');
        
    return res.send(rtnMessage);
  }
  
  // Actualizar la tabla USER_COLLECTION desde la tabla Datalake.payment_commit
  private async actualizarDesdePaymentCommit(): Promise<{}> {

    let processMessage = {};  // mensaje a guardar como resultado de la operación
    try {
      
      // Buscar el id del ultimo registro actualizado
      const connectionDWHBP = getConnection('Datalake');
      const ultimoId = await this.buscarUltimoId(connectionDWHBP, 'payment_commit');
      
      // Leer los registros nuevos a procesar de la tabla payment_commit
      const paymentCommits = await paymentCommitService.listNew(ultimoId);
      
      // Procesar los registros leídos y guardarlos en DWHBP.user_collection
      processMessage = await this.grabarDesdePaymentCommit(paymentCommits);

      // Guardar el resultado en la tabla DWHBP.procesos_batchs
      return processMessage;

    } catch (err) {
      console.log('*** ERR:', err);
      /* processMessage = err;
      emailService.sendMail(
        'gonzalo.mtanoira@gmail.com',
        'HotGo-USER_COLLECTION: actualizacion desde payment_commit',
        processMessage
      ); */
      return {status: 'fail', message: `MAIL error ${err}`};
    }
  }

  // Busar el último registro Id que se actualizó. Este id se encuentra en la tabla DWHBP.procesos_batchs
  private async buscarUltimoId(connection: Connection, tabla: string): Promise<number> {
    
    let ultimoId: number;
    try {
      const procesoBatch = await connection.getRepository(ProcesosBatch)
        .createQueryBuilder("batch")
        .where('batch.tabla = :tabla', { tabla: 'payment_commit'})
        .orderBy('batch.alta_date', "DESC")
        .getOne();

      ultimoId = procesoBatch.idFk;
      
    } catch (error) {
      ultimoId = 0;
      console.log('*** ERROR: ProcesosBatch.ultimo_id: ', ultimoId);
    }
    return ultimoId;
  }
  
  // Busar el último registro Id que se actualizó. Este id se encuentra en la tabla DWHBP.procesos_batchs
  private async grabarDesdePaymentCommit(paymentCommits: PaymentCommit[]): Promise<{}> {

    // Definir variables
    let rtnMessage = {};  // mensaje de retorno de la funcion
    let rtnStatus = 'fail';  // status de retorno de la función
    let userInexistentes = 0;

    // Variables registro userCollection
    let currency: String;
    let exchRate: String;
    let amountUsd: Number;
    let paymStatus: String;
    let paymDescription: String;
    let user: StRegister;
    let timestampLocal: String;
    let timestampAr: String;
    let values = []; // lugar donde se guardaran todos los VALUES() del INSERT INTO a realizar

    // Chequear que haya por lo menos 1 registro
    if (paymentCommits && paymentCommits.length > 0) {

      try {

        let cantRegsProcesados = 0; 
        let cantRegsGrabados = 0; 

        for (const payment of paymentCommits) {
          
          // Calcular los datos faltantes

          // Buscar Usuario
          user = await stRegisterService.getByUserId(payment.userId);
          if (user) {
            
            // Exch_rate y amount_usd
            currency = await auxiliarTablesService.getMonedaPais(user.country);
            console.log('*** Moneda: ', currency);
            // Chequear si no lo encontró y enviarlo al Logger
            if (!currency) { 
              const errMessage = `Falta definir la moneda para el país ${user.country} del usuario ${payment.userId}`;
              loggerService.crearLogActualizar(errMessage);

              exchRate = '';
              amountUsd = 0;

            } else {
              // Buscar la cotización en el SAP
              try {
                const response = await axios.get(`${SAPGW_SERVER}/api2/convertir_importe`, {
                  params: {
                    importe: payment.amount,
                    monorigen: currency,
                    mondestino: 'USD',
                    fecha: moment(payment.timestamp).format('YYYYMMDD')
                  },
                  headers: {
                    "Authorization": "Bearer BYPASS"
                  }
                });
                exchRate = response.data['cotizacion'];
                amountUsd = response.data['importe'];
                
              } catch (error) {
                exchRate = '';
                amountUsd = 0;
              }
            }
            
          } else {
            console.log('*** User inexsitente en st_register:');
            // Timestamps
            timestampLocal = '';
            timestampAr = '';
            // ExchRate y amountUsd
            currency = '';
            exchRate = '';
            amountUsd = 0;
            userInexistentes += 1;
          }
          
          // paym_status (null: no se pudo determinar)
          paymStatus = await auxiliarTablesService.getPaymStatus(payment.status);
          // Chequear si no lo encontró y enviarlo al Logger
          if (!paymStatus) { 
            const errMessage = `El registro ${payment.id} de la tabla Datalake.payment_commit posee el siguiente status (${payment.status}) que no está definido en la tabla DWHBP.field_status.`;
            loggerService.crearLogActualizar(errMessage); 
          }

          // paym_description
          if (paymStatus === 'no aprobado') {
            paymDescription = 'rechazado';
          } else if (paymStatus == null) {
            paymDescription = '';
          } else {
            paymDescription = await paymentCommitService.getPaymDescription(payment);
          }
          
          // Armar el registro
          let value = {
            userId: payment.userId,
            event: payment.event,
            timestamp: payment.timestamp,
            source: payment.source,
            status: payment.status,
            paymDescription: paymDescription,
            paymProcessor: payment.methodName,
            paymStatus: paymStatus,
            paymType: payment.paymentType,
            paymOrigin: 'user',
            message: payment.message,
            duration: payment.duration,
            trial: payment.trial,
            trialDuration: payment.trialDuration,
            package: payment.package === 'NULL' ? null : payment.package,
            isSuscription: payment.isSuscription,
            accessUntil: payment.accessUntil,
            amount: payment.amount,
            discount: payment.discount,
            currency: currency,
            exchRate: exchRate,
            amountUsd: amountUsd,
            idFk: payment.id
          };

          // Guardar el registro en values
          values.push(value);
          cantRegsProcesados += 1;

          // Hacer el INSERT INTO cada 300 registros
          if (cantRegsProcesados !== 0 && cantRegsProcesados%300 === 0) {
            await this.inserIntotUserCollection(values)
              .then( (res) => {
                console.log('*** GRABAR:', res['message'].message);
                cantRegsGrabados += res['message'].affectedRows;
              })
              .catch( (err) => {
                // Hacer un rollback y terminar
                rtnStatus = 'fail';
                rtnMessage = err.message;
                return { status: rtnStatus, message: rtnMessage };
              });
            
              values = [];
          }
        };  // end for..of

        // Grabar el último lote de VALUES
        if (values.length > 0) {
          await this.inserIntotUserCollection(values)
              .then( (res) => {
                console.log('*** GRABANDO ultimo lote:', res['message'].message);
                cantRegsGrabados += res['message'].affectedRows;
              })
              .catch( (err) => {
                // Hacer un rollback y terminar
                rtnStatus = 'fail';
                rtnMessage = err.message;
                return { status: rtnStatus, message: rtnMessage };
              });
        }
      } catch (error) {
        console.log('*** grabarPaymentCommits() ERROR:', error);
        rtnStatus = 'fail';
        rtnMessage = error;
      }

    } else {
      // No hay registros que procesar
      rtnStatus = 'ok';
      rtnMessage = 'Se insertaron 0 registros';
    }

    return { status: rtnStatus, message: rtnMessage };
  }

  // Ejecutar el INSERT INTO
  private async inserIntotUserCollection(values: any[]): Promise<{}> {

    try {
      const connUserCollection = getConnection('DWHBP');
      const response = await connUserCollection.getRepository(UserCollection)
        .createQueryBuilder()
        .insert()
        .values(values)
        .execute();
      console.log('*** INSERT OK:');
      console.log(response);

      return { status: 'ok', message: response };

    } catch (error) {
      console.log('*** INSERT ERROR:');
      console.log(error);
      return { status: 'fail', message: `Error en INSERT INTO a la tabla: ${error}` };
    }
  }
  
  private async list(req: Request, res: Response): Promise<void> {
    res.send(await userCollectionService.list());
  }

}
