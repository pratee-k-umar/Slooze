import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Country } from '../../common/enums/country.enum';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(Country)
  @IsNotEmpty()
  country: Country;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
