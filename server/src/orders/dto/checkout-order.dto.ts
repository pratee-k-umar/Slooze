import { IsUUID, IsNotEmpty } from 'class-validator';

export class CheckoutOrderDto {
  @IsUUID()
  @IsNotEmpty()
  paymentMethodId: string;
}
