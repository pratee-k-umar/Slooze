import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { MenuCategory } from '../../common/enums/menu-category.enum';

export class CreateMenuItemDto {
  @IsUUID()
  @IsNotEmpty()
  restaurantId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsEnum(MenuCategory)
  @IsNotEmpty()
  category: MenuCategory;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
