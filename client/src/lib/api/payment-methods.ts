import apiClient from './client';
import { PaymentMethod } from '@/types/payment-method';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const paymentMethodsApi = {
  getAll: async (): Promise<PaymentMethod[]> => {
    const response = await apiClient.get<ApiResponse<PaymentMethod[]>>('/payment-methods');
    return response.data.data;
  },

  update: async (id: string, isActive: boolean): Promise<PaymentMethod> => {
    const response = await apiClient.patch<ApiResponse<PaymentMethod>>(`/payment-methods/${id}`, { isActive });
    return response.data.data;
  },
};
