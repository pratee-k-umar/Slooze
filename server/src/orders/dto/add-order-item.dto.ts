import { IsUUID, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddOrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  menuItemId: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}
