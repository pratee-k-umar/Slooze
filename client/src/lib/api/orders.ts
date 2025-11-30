import apiClient from './client';
import { Order, CreateOrderDto, AddOrderItemDto, CheckoutOrderDto } from '@/types/order';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders');
    return response.data.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  },

  create: async (data: CreateOrderDto): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', data);
    return response.data.data;
  },

  addItem: async (orderId: string, data: AddOrderItemDto): Promise<void> => {
    await apiClient.post(`/orders/${orderId}/items`, data);
  },

  checkout: async (orderId: string, data: CheckoutOrderDto): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(`/orders/${orderId}/checkout`, data);
    return response.data.data;
  },

  cancel: async (orderId: string): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(`/orders/${orderId}/cancel`);
    return response.data.data;
  },
};
