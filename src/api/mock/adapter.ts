import type { AxiosAdapter, AxiosResponse } from 'axios';
import { handleMockRequest } from './handlers';

/**
 * Custom Axios adapter — intercepts all requests and returns fake data
 * without hitting the network. Real axios interceptors still run.
 */
export const mockAdapter: AxiosAdapter = async (config) => {
  const { data, status } = await handleMockRequest(config);

  const response: AxiosResponse = {
    data,
    status,
    statusText: status >= 200 && status < 300 ? 'OK' : 'Error',
    headers: { 'content-type': 'application/json' },
    config,
    request: {},
  };

  if (status >= 400) {
    return Promise.reject({
      isAxiosError: true,
      response,
      config,
      message: `Request failed with status ${status}`,
    });
  }

  return response;
};
