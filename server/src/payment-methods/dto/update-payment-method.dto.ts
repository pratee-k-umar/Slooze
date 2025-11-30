import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePaymentMethodDto {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
