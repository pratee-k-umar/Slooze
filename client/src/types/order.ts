import { Country } from "./user";
import { MenuItem } from "./menu-item";
import { Restaurant } from "./restaurant";
import { PaymentMethod } from "./payment-method";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  subtotal: number;
  menuItem?: MenuItem;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  status: OrderStatus;
  totalAmount: number;
  paymentMethodId?: string;
  paymentStatus: PaymentStatus;
  country: Country;
  createdAt: string;
  updatedAt: string;
  restaurant?: Restaurant;
  orderItems?: OrderItem[];
  paymentMethod?: PaymentMethod;
}

export interface CreateOrderDto {
  restaurantId: string;
}

export interface AddOrderItemDto {
  menuItemId: string;
  quantity: number;
}

export interface CheckoutOrderDto {
  paymentMethodId: string;
}
