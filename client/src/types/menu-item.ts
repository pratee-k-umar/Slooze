export enum MenuCategory {
  APPETIZER = 'appetizer',
  MAIN = 'main',
  DESSERT = 'dessert',
  BEVERAGE = 'beverage',
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  category: MenuCategory;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}
