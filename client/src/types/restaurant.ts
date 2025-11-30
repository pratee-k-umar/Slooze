import { Country } from "./user";

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  country: Country;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRestaurantDto {
  name: string;
  description?: string;
  address: string;
  country: Country;
}
