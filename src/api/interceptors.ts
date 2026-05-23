import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { apiClient } from '@/api/client';
import { tokenStorage } from '@/api/tokenStorage';
import { API_RETRY_COUNT } from '@/constants';

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _retryCount?: number;
  _skipAuth?: boolean;
};

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  refreshQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else if (token) promise.resolve(token);
  });
  refreshQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const { data } = await apiClient.post<{ tokens: { accessToken: string; refreshToken: string } }>(
    API_ENDPOINTS.AUTH.REFRESH,
    { refreshToken },
    { _skipAuth: true } as RetryConfig,
  );

  tokenStorage.set(data.tokens);
  return data.tokens.accessToken;
};

export const setupInterceptors = (): void => {
  apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const cfg = config as RetryConfig;
    if (cfg._skipAuth) return config;

    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryConfig | undefined;
      if (!originalRequest || originalRequest._retry) {
        return Promise.reject(error);
      }

      const status = error.response?.status;
      const isAuthEndpoint =
        originalRequest.url?.includes(API_ENDPOINTS.AUTH.LOGIN) ||
        originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH);

      // Token refresh flow on 401
      if (status === 401 && !isAuthEndpoint) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(apiClient(originalRequest));
              },
              reject,
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          tokenStorage.clear();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Retry logic for network / 5xx
      const retryCount = originalRequest._retryCount ?? 0;
      const shouldRetry =
        retryCount < API_RETRY_COUNT && (!error.response || error.response.status >= 500);

      if (shouldRetry) {
        originalRequest._retryCount = retryCount + 1;
        await new Promise((r) => setTimeout(r, 300 * (retryCount + 1)));
        return apiClient(originalRequest);
      }

      return Promise.reject(error);
    },
  );
};
