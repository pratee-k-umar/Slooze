import apiClient from './client';
import { MenuItem } from '@/types/menu-item';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const menuItemsApi = {
  getAll: async (): Promise<MenuItem[]> => {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>('/menu-items');
    return response.data.data;
  },

  getByRestaurant: async (restaurantId: string): Promise<MenuItem[]> => {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>(`/menu-items/restaurant/${restaurantId}`);
    return response.data.data;
  },

  getById: async (id: string): Promise<MenuItem> => {
    const response = await apiClient.get<ApiResponse<MenuItem>>(`/menu-items/${id}`);
    return response.data.data;
  },
};
