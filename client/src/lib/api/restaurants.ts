import apiClient from './client';
import { Restaurant, CreateRestaurantDto } from '@/types/restaurant';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const restaurantsApi = {
  getAll: async (): Promise<Restaurant[]> => {
    const response = await apiClient.get<ApiResponse<Restaurant[]>>('/restaurants');
    return response.data.data;
  },

  getById: async (id: string): Promise<Restaurant> => {
    const response = await apiClient.get<ApiResponse<Restaurant>>(`/restaurants/${id}`);
    return response.data.data;
  },

  create: async (data: CreateRestaurantDto): Promise<Restaurant> => {
    const response = await apiClient.post<ApiResponse<Restaurant>>('/restaurants', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<CreateRestaurantDto>): Promise<Restaurant> => {
    const response = await apiClient.patch<ApiResponse<Restaurant>>(`/restaurants/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/restaurants/${id}`);
  },
};
