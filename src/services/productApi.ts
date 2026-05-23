import { apiClient, API_ENDPOINTS } from '@/api';
import type {
  PaginatedProducts,
  Product,
  ProductCategory,
  ProductSortField,
  ProductSortOrder,
} from '@/types';

export type GetProductsParams = {
  page: number;
  limit: number;
  search?: string;
  category?: ProductCategory;
  sortBy?: ProductSortField;
  sortOrder?: ProductSortOrder;
};

export const productApi = {
  getList: (params: GetProductsParams) =>
    apiClient.get<PaginatedProducts>(API_ENDPOINTS.PRODUCTS.LIST, { params }),

  getById: (id: string) => apiClient.get<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id)),
};
