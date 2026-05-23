import { setupInterceptors } from './interceptors';

export { apiClient } from './client';
export { API_ENDPOINTS } from './endpoints';
export { tokenStorage, EXPIRED_ACCESS_TOKEN } from './tokenStorage';

setupInterceptors();
