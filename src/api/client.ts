import axios, { type AxiosInstance } from 'axios';
import { env } from '@/config';
import { mockAdapter } from '@/api/mock/adapter';

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Fake backend: every request goes through mock adapter
  adapter: mockAdapter,
});

export default apiClient;
