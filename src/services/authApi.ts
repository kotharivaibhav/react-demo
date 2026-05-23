import { apiClient, API_ENDPOINTS } from '@/api';
import type { LoginResponse, User } from '@/types';
import type { AuthTokens } from '@/types';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, { email, password }),

  signup: (name: string, email: string, password: string) =>
    apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.SIGNUP, { name, email, password }),

  googleLogin: (payload: { email?: string; name?: string; idToken?: string }) =>
    apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.GOOGLE, payload),

  refresh: (refreshToken: string) =>
    apiClient.post<{ tokens: AuthTokens }>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken }),

  logout: () => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),

  me: () => apiClient.get<User>(API_ENDPOINTS.AUTH.ME),

  updateProfile: (data: Partial<User>) => apiClient.patch<User>(API_ENDPOINTS.AUTH.PROFILE, data),
};
