import { getConnection } from 'typeorm';

// Models
import { PaymentCommit } from '../models/payment_commit.model';
import { UserCollection } from '../models/user_collection.model';

export class UserCollectionService {

  // Grabar un nuevo registro en la tabla
  public async create(userCollection: UserCollection): Promise<UserCollection> {
    const connection = getConnection('DWHBP');
    return await connection.getRepository(UserCollection).save(userCollection);
  }

  // Listar todos los registros de la tabla
  public async list(): Promise<UserCollection[]> {  
    const connection = getConnection('DWHBP');
    return await connection.getRepository(UserCollection).find();
  }
  
  // Obtener el valor del campo UserCollection.paymDescription
  public async getPaymDescription(payment: PaymentCommit): Promise<String> {
    console.log('***PASO');

    // Buscar si existe otro payment del usuario anterior a este pago
    try {
      const connection = getConnection('DWHBP');
      const userCollection = await connection.getRepository(UserCollection)
        .createQueryBuilder()
        .where('user_id = :userId', {userId: payment.userId})
        .andWhere('event = :event', {event: payment.event})
        .andWhere('paym_type = :paymType', {paymType: payment.paymentType})
        .andWhere('timestamp <= :timestamp', {timestamp: payment.timestamp})
        .orderBy('timestamp', 'DESC')
        .getOne();
      
      console.log('*** userCollection:');
      console.log(userCollection);
      return (userCollection) ? ((userCollection.paymType === 'online') ? 'reactivacion' : 'recobro') : 'alta';
    
    } catch (error) {
      console.log('*** paymDescription ERROR:');
      console.log(error);
      return 'alta';
    }
  }

}

export const userCollectionService = new UserCollectionService();
