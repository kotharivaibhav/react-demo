import { apiClient, API_ENDPOINTS } from '@/api';
import type { Address } from '@/types';

export type CheckoutPayload = {
  shippingAddress: Address;
  paymentMethod: string;
  notes?: string;
};

export type CheckoutResponse = {
  orderId: string;
  status: string;
  message: string;
};

export const orderApi = {
  checkout: (payload: CheckoutPayload) =>
    apiClient.post<CheckoutResponse>(API_ENDPOINTS.ORDERS.CHECKOUT, payload),
};
