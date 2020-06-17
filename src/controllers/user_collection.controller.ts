import { Controller } from './controller';
import { getConnection, Connection } from 'typeorm';
import { HttpServer } from '../server/httpServer';
import { Request, Response } from 'restify';

// Librerías externas
import * as moment from 'moment';

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

// Common Functions
import { ToTimeZone } from '../common/functions.common';

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
  private async actualizar(req: Request, res: Response): Promise<void> {

    // Actualizar desde la payment_commit
    this.actualizarDesdePaymentCommit();
        
    return res.send('Actualizado OK');
  }
  
  // Actualizar la tabla USER_COLLECTION desde la tabla Datalake.payment_commit
  private async actualizarDesdePaymentCommit(): Promise<String> {

    let processMessage = '';  // mensaje a guardar como resultado de la operación
    try {
      
      // Buscar el id del ultimo registro actualizado
      const connectionDWHBP = getConnection('Datalake');
      const ultimoId = await this.buscarUltimoId(connectionDWHBP, 'payment_commit');

      // Leer los registros nuevos a procesar de la tabla payment_commit
      const paymentCommits = await paymentCommitService.listNew(ultimoId);

      // Procesar los registros leídos y guardarlos en DWHBP.user_collection
      processMessage = await this.grabarDesdePaymentCommit(paymentCommits);

      // Guardar el resultado en la tabla DWHBP.procesos_batchs
      return 'ok';

    } catch (err) {
      console.log('*** ERR:', err);
      /* processMessage = err;
      emailService.sendMail(
        'gonzalo.mtanoira@gmail.com',
        'HotGo-USER_COLLECTION: actualizacion desde payment_commit',
        processMessage
      ); */
      return 'Fail';
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
    }
    return ultimoId;
  }
  
  // Busar el último registro Id que se actualizó. Este id se encuentra en la tabla DWHBP.procesos_batchs
  private async grabarDesdePaymentCommit(paymentCommits: PaymentCommit[]): Promise<any> {

    // Definir variables
    const MAX_LENGTH = 30 * 1024;  // maximo length para los VALUES() del INSERT
    let rtnMessage = {};  // mensaje de retorno de la funcion
    let paymStatus: String;
    let paymDescription: String;
    let user: StRegister;
    let timestamp: String;
    let timestampLocal: String;
    let timestampAr: String;

    let insertValues = '';
    // Chequear que haya por lo menos 1 registro
    if (paymentCommits && paymentCommits.length > 0) {
      
      paymentCommits.forEach( async (payment) => {

        // Buscar Usuario
        user = await stRegisterService.getByUserId(payment.userId);
        if (user) {
          console.log('*** USER:');
          console.log(user);
          
          // Calcular los Timestamps
          timestampLocal = await ToTimeZone(payment.timestamp, user.country);
          timestampAr = await ToTimeZone(payment.timestamp, 'AR');
          console.log('*** TIMESTAMPs:');
          console.log(typeof(payment.timestamp));
          console.log(payment.timestamp, timestampLocal, timestampAr);
          
        } else {
          console.log('*** USER:');
          console.log(user);
          null;
        }

        // Calcular los datos faltantes
        
        // paym_status (null: no se pudo determinar)
        const fieldStatus = (await auxiliarTablesService.getPaymStatus(payment.status));
        paymStatus = fieldStatus.paymStatus;
        console.log('*** paymStatus:', paymStatus);
        // Chequear si no lo encontró y enviarlo al Logger
        if (paymStatus == null) { 
          const errMessage = `El registro ${payment.id} de la tabla Datalake.payment_commit posee el siguiente status (${payment.status}) que no está definido en la tabla DWHBP.field_status.`;
          loggerService.crearLogActualizar(errMessage); 
        }

        // paym_description
        if (paymStatus === 'no aprobado') {
          paymDescription = 'rechazado';
        } else if (paymStatus == null) {
          paymDescription = '';
        } else {
          paymDescription = await userCollectionService.getPaymDescription(payment);
        }
        console.log('*** paymDescription (P):', paymDescription);
        

        // Armar el registro   ,'${payment.}'
        let values = `('${payment.userId}','${payment.event}','${payment.timestamp}','${timestampLocal}','${timestampAr}'`;
        values += `,'${payment.source}','${payment.status}','${paymDescription}','${payment.methodName}'`;
        console.log('*** VALUES:', values);


        
      });
    } else {
      rtnMessage = 'Se insertaron 0 registros';
    }
  }
  
  private async list(req: Request, res: Response): Promise<void> {
    res.send(await userCollectionService.list());
  }

}
