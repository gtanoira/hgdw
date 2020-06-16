import { Connection, getConnection } from 'typeorm';

// Models
import { ProcesosBatch } from '../models/proceso_batch.model';
import { UserCollectionModel } from '../models/user_collection.model';

// Databases
import { HotGoDBase } from '../database/index';

// Services
import { emailService } from '../services/email.service';
import { paymentCommitService } from '../services/payment_commit.service'

export class UserCollectionService {

  /*
   * Actualizar la tabla USER_COLLECTION
   * Esta tabla se alimenta de 2 tablas: la payment_commit y la rebill.
   * Ambas tablas se encuentran dentro del schema Datalake.
  */
  public async actualizar(): Promise<{}> {

    // Actualizar desde la payment_commit
    this.actualizarDesdePaymentCommit();
    
    return {};
    // return await connection.getRepository(UserCollectionModel).save(userCollection);
  }

  public async create(userCollection: UserCollectionModel): Promise<UserCollectionModel> {
    const connection = getConnection('DWHBP');
    return await connection.getRepository(UserCollectionModel).save(userCollection);
  }

  public async list(): Promise<UserCollectionModel[]> {  
    const connection = getConnection('DWHBP');
    return await connection.getRepository(UserCollectionModel).find();
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
      console.log('*** payment_commits:', paymentCommits);

      // Procesar los registros leídos y guardarlos en DWHBP.user_collection
      //processMessage = await grabarDesdePaymentCommit(paymentCommits);

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
}

export const userCollectionService = new UserCollectionService();
