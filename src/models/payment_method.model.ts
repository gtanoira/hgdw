import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Interfaces
class PaymentMethodRO {
  id!: number;
  paymProcessor!: string;
  country!: string;
  currency!: string;
  amount!: number;
  trial!: string;
}

@Entity({
  name: 'payment_methods',
  database: AWS_DBASE,
  // schema: 'ProcesosBatchsSchema',
  synchronize: false  // no incluir en migration
})
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ name: 'paym_processor' })
  public paymProcessor!: string;

  @Column()
  public country!: string;

  @Column()
  public currency!: string;
  
  @Column({ type: 'decimal', precision: 16, scale: 2, default: 0 })
  public amount?: number;

  @Column({ default: '1' })
  public trial!: string;
}

// What to show as response from a http request
export function paymentMethodToResponse(paymentMethod: PaymentMethod): PaymentMethodRO {
  const responseObj = { 
    id: +paymentMethod.id,
    paymProcessor: paymentMethod.paymProcessor,
    country: paymentMethod.country,
    currency: paymentMethod.currency,
    amount: paymentMethod.amount ? Number(paymentMethod.amount) : 0,
    trial: paymentMethod.trial
  };
  return responseObj;
}

