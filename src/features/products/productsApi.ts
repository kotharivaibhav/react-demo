import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/redux/axiosBaseQuery';
import { API_ENDPOINTS } from '@/api/endpoints';
import type {
  PaginatedProducts,
  Product,
  ProductCategory,
  ProductSortField,
  ProductSortOrder,
} from '@/types';

export type ProductsQueryArgs = {
  page?: number;
  limit?: number;
  search?: string;
  category?: ProductCategory;
  sortBy?: ProductSortField;
  sortOrder?: ProductSortOrder;
};

const serializeProductsQuery = ({ queryArgs }: { queryArgs: ProductsQueryArgs }) =>
  JSON.stringify({
    page: queryArgs.page ?? 1,
    limit: queryArgs.limit ?? 6,
    search: queryArgs.search ?? '',
    category: queryArgs.category ?? 'all',
    sortBy: queryArgs.sortBy ?? 'name',
    sortOrder: queryArgs.sortOrder ?? 'asc',
  });

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Product', 'ProductList'],
  keepUnusedDataFor: 120,
  refetchOnMountOrArgChange: 30,
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedProducts, ProductsQueryArgs>({
      query: ({
        page = 1,
        limit = 6,
        search = '',
        category = 'all',
        sortBy = 'name',
        sortOrder = 'asc',
      }) => ({
        url: API_ENDPOINTS.PRODUCTS.LIST,
        method: 'GET',
        params: { page, limit, search, category, sortBy, sortOrder },
      }),
      serializeQueryArgs: serializeProductsQuery,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'ProductList', id: 'LIST' },
            ]
          : [{ type: 'ProductList', id: 'LIST' }],
    }),
    getAllProducts: builder.query<Product[], void>({
      query: () => ({ url: API_ENDPOINTS.PRODUCTS.ALL, method: 'GET' }),
      providesTags: [{ type: 'ProductList', id: 'ALL' }],
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => ({
        url: API_ENDPOINTS.PRODUCTS.BY_ID(id),
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useLazyGetProductsQuery,
} = productsApi;

/** Invalidate RTK Query cache when stock changes or checkout completes */
export const invalidateProductCache = productsApi.util.invalidateTags([
  { type: 'ProductList', id: 'LIST' },
  { type: 'ProductList', id: 'ALL' },
]);
