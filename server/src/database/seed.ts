import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { MenuItem } from '../menu-items/entities/menu-item.entity';
import { PaymentMethod } from '../payment-methods/entities/payment-method.entity';
import { Role } from '../common/enums/role.enum';
import { Country } from '../common/enums/country.enum';
import { MenuCategory } from '../common/enums/menu-category.enum';
import { PaymentType } from '../common/enums/payment-type.enum';

export async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const restaurantRepository = dataSource.getRepository(Restaurant);
  const menuItemRepository = dataSource.getRepository(MenuItem);
  const paymentMethodRepository = dataSource.getRepository(PaymentMethod);

  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      email: 'nick.fury@shield.com',
      password: hashedPassword,
      name: 'Nick Fury',
      role: Role.ADMIN,
      country: undefined,
    },
    {
      email: 'captain.marvel@india.com',
      password: hashedPassword,
      name: 'Captain Marvel',
      role: Role.MANAGER,
      country: Country.INDIA,
    },
    {
      email: 'captain.america@usa.com',
      password: hashedPassword,
      name: 'Captain America',
      role: Role.MANAGER,
      country: Country.AMERICA,
    },
    {
      email: 'thanos@india.com',
      password: hashedPassword,
      name: 'Thanos',
      role: Role.MEMBER,
      country: Country.INDIA,
    },
    {
      email: 'thor@india.com',
      password: hashedPassword,
      name: 'Thor',
      role: Role.MEMBER,
      country: Country.INDIA,
    },
    {
      email: 'travis@usa.com',
      password: hashedPassword,
      name: 'Travis',
      role: Role.MEMBER,
      country: Country.AMERICA,
    },
  ];

  console.log('Seeding users...');
  await userRepository.save(users);

  const paymentMethods = [
    { name: 'Credit Card', type: PaymentType.CREDIT_CARD, isActive: true },
    { name: 'Debit Card', type: PaymentType.DEBIT_CARD, isActive: true },
    { name: 'UPI', type: PaymentType.UPI, isActive: true },
    { name: 'Cash on Delivery', type: PaymentType.CASH, isActive: true },
  ];

  console.log('Seeding payment methods...');
  await paymentMethodRepository.save(paymentMethods);

  const indiaRestaurants = [
    {
      name: 'Taj Mahal Restaurant',
      description: 'Authentic Indian cuisine with royal flavors',
      address: 'Colaba, Mumbai, Maharashtra',
      country: Country.INDIA,
    },
    {
      name: 'Spice Garden',
      description: 'South Indian delicacies and traditional recipes',
      address: 'Indiranagar, Bangalore, Karnataka',
      country: Country.INDIA,
    },
    {
      name: 'Royal Biryani House',
      description: 'Best biryani in town with authentic Hyderabadi flavors',
      address: 'Banjara Hills, Hyderabad, Telangana',
      country: Country.INDIA,
    },
    {
      name: 'Curry Palace',
      description: 'North Indian specialties and tandoori delights',
      address: 'Connaught Place, Delhi, NCR',
      country: Country.INDIA,
    },
    {
      name: 'Masala Magic',
      description: 'Street food favorites and chaat specialties',
      address: 'Koregaon Park, Pune, Maharashtra',
      country: Country.INDIA,
    },
  ];

  const americaRestaurants = [
    {
      name: 'The American Diner',
      description: 'Classic American comfort food and all-day breakfast',
      address: '5th Avenue, New York, NY',
      country: Country.AMERICA,
    },
    {
      name: 'Burger Haven',
      description: 'Gourmet burgers and hand-cut fries',
      address: 'Hollywood Blvd, Los Angeles, CA',
      country: Country.AMERICA,
    },
    {
      name: 'Pizza Paradise',
      description: 'Wood-fired pizzas and Italian classics',
      address: 'Michigan Avenue, Chicago, IL',
      country: Country.AMERICA,
    },
    {
      name: 'Steakhouse Supreme',
      description: 'Premium steaks and fresh seafood',
      address: 'Downtown, Houston, TX',
      country: Country.AMERICA,
    },
    {
      name: 'Taco Fiesta',
      description: 'Mexican-American fusion and authentic tacos',
      address: 'Mission District, San Francisco, CA',
      country: Country.AMERICA,
    },
  ];

  console.log('Seeding restaurants...');
  const savedIndiaRestaurants = await restaurantRepository.save(
    indiaRestaurants,
  );
  const savedAmericaRestaurants = await restaurantRepository.save(
    americaRestaurants,
  );

  const tajMahalMenuItems = [
    {
      restaurantId: savedIndiaRestaurants[0].id,
      name: 'Samosa',
      description: 'Crispy pastry filled with spiced potatoes',
      price: 5.99,
      category: MenuCategory.APPETIZER,
    },
    {
      restaurantId: savedIndiaRestaurants[0].id,
      name: 'Paneer Tikka',
      description: 'Grilled cottage cheese with aromatic spices',
      price: 12.99,
      category: MenuCategory.APPETIZER,
    },
    {
      restaurantId: savedIndiaRestaurants[0].id,
      name: 'Butter Chicken',
      description: 'Creamy tomato curry with tender chicken',
      price: 15.99,
      category: MenuCategory.MAIN,
    },
    {
      restaurantId: savedIndiaRestaurants[0].id,
      name: 'Chicken Biryani',
      description: 'Fragrant basmati rice with spiced chicken',
      price: 14.99,
      category: MenuCategory.MAIN,
    },
    {
      restaurantId: savedIndiaRestaurants[0].id,
      name: 'Dal Makhani',
      description: 'Black lentils in creamy tomato sauce',
      price: 11.99,
      category: MenuCategory.MAIN,
    },
    {
      restaurantId: savedIndiaRestaurants[0].id,
      name: 'Gulab Jamun',
      description: 'Sweet milk dumplings in sugar syrup',
      price: 6.99,
      category: MenuCategory.DESSERT,
    },
    {
      restaurantId: savedIndiaRestaurants[0].id,
      name: 'Mango Lassi',
      description: 'Refreshing yogurt drink with mango',
      price: 4.99,
      category: MenuCategory.BEVERAGE,
    },
  ];

  const spiceGardenMenuItems = [
    {
      restaurantId: savedIndiaRestaurants[1].id,
      name: 'Masala Dosa',
      description: 'Crispy rice crepe with potato filling',
      price: 8.99,
      category: MenuCategory.MAIN,
    },
    {
      restaurantId: savedIndiaRestaurants[1].id,
      name: 'Idli Sambar',
      description: 'Steamed rice cakes with lentil soup',
      price: 7.99,
      category: MenuCategory.MAIN,
    },
    {
      restaurantId: savedIndiaRestaurants[1].id,
      name: 'Vada',
      description: 'Crispy lentil donuts',
      price: 6.99,
      category: MenuCategory.APPETIZER,
    },
    {
      restaurantId: savedIndiaRestaurants[1].id,
      name: 'Filter Coffee',
      description: 'Traditional South Indian coffee',
      price: 3.99,
      category: MenuCategory.BEVERAGE,
    },
  ];

  const americanDinerMenuItems = [
    {
      restaurantId: savedAmericaRestaurants[0].id,
      name: 'Classic Pancakes',
      description: 'Fluffy pancakes with maple syrup',
      price: 9.99,
      category: MenuCategory.MAIN,
    },
    {
      restaurantId: savedAmericaRestaurants[0].id,
      name: 'Eggs Benedict',
      description: 'Poached eggs with hollandaise sauce',
      price: 12.99,
      category: MenuCategory.MAIN,
    },
    {
      restaurantId: savedAmericaRestaurants[0].id,
      name: 'French Fries',
      description: 'Crispy golden fries',
      price: 5.99,
      category: MenuCategory.APPETIZER,
    },
    {
      restaurantId: savedAmericaRestaurants[0].id,
      name: 'Milkshake',
      description: 'Creamy vanilla milkshake',
      price: 6.99,
      category: MenuCategory.BEVERAGE,
    },
  ];

  const burgerHavenMenuItems = [
    {
      restaurantId: savedAmericaRestaurants[1].id,
      name: 'Classic Burger',
      description: 'Beef patty with lettuce, tomato, and cheese',
      price: 11.99,
      category: MenuCategory.MAIN,
    },
    {
      restaurantId: savedAmericaRestaurants[1].id,
      name: 'Bacon Cheeseburger',
      description: 'Double patty with bacon and cheese',
      price: 14.99,
      category: MenuCategory.MAIN,
    },
    {
      restaurantId: savedAmericaRestaurants[1].id,
      name: 'Onion Rings',
      description: 'Crispy battered onion rings',
      price: 6.99,
      category: MenuCategory.APPETIZER,
    },
    {
      restaurantId: savedAmericaRestaurants[1].id,
      name: 'Coca Cola',
      description: 'Refreshing soda',
      price: 2.99,
      category: MenuCategory.BEVERAGE,
    },
  ];

  const pizzaParadiseMenuItems = [
    {
      restaurantId: savedAmericaRestaurants[2].id,
      name: 'Margherita Pizza',
      description: 'Classic tomato, mozzarella, and basil',
      price: 13.99,
      category: MenuCategory.MAIN,
    },
    {
      restaurantId: savedAmericaRestaurants[2].id,
      name: 'Pepperoni Pizza',
      description: 'Loaded with pepperoni and cheese',
      price: 15.99,
      category: MenuCategory.MAIN,
    },
    {
      restaurantId: savedAmericaRestaurants[2].id,
      name: 'Garlic Bread',
      description: 'Toasted bread with garlic butter',
      price: 5.99,
      category: MenuCategory.APPETIZER,
    },
    {
      restaurantId: savedAmericaRestaurants[2].id,
      name: 'Tiramisu',
      description: 'Classic Italian dessert',
      price: 7.99,
      category: MenuCategory.DESSERT,
    },
  ];

  console.log('Seeding menu items...');
  await menuItemRepository.save([
    ...tajMahalMenuItems,
    ...spiceGardenMenuItems,
    ...americanDinerMenuItems,
    ...burgerHavenMenuItems,
    ...pizzaParadiseMenuItems,
  ]);

  console.log('Database seeded successfully!');
  console.log('\nTest Users:');
  console.log('Admin: nick.fury@shield.com / password123');
  console.log('Manager (India): captain.marvel@india.com / password123');
  console.log('Manager (America): captain.america@usa.com / password123');
  console.log('Member (India): thanos@india.com / password123');
  console.log('Member (India): thor@india.com / password123');
  console.log('Member (America): travis@usa.com / password123');
}
