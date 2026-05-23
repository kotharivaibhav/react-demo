import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productApi } from '@/services/productApi';
import type { Product } from '@/types';

export type ProductState = {
  list: Product[];
  page: number;
  hasMore: boolean;
  total: number;
  totalPages: number;
  search: string;
  selectedProduct: Product | null;
  listStatus: 'idle' | 'loading' | 'loadingMore' | 'failed';
  detailStatus: 'idle' | 'loading' | 'failed';
  error: string | null;
};

const initialState: ProductState = {
  list: [],
  page: 0,
  hasMore: true,
  total: 0,
  totalPages: 1,
  search: '',
  selectedProduct: null,
  listStatus: 'idle',
  detailStatus: 'idle',
  error: null,
};

export const fetchProductsPage = createAsyncThunk(
  'products/fetchPage',
  async (
    params: {
      page: number;
      limit: number;
      search: string;
      category?: import('@/types').ProductCategory;
      sortBy?: import('@/types').ProductSortField;
      sortOrder?: import('@/types').ProductSortOrder;
      append?: boolean;
    },
    { rejectWithValue },
  ) => {
    try {
      const { append = false, ...query } = params;
      const { data } = await productApi.getList(query);
      return { ...data, append };
    } catch {
      return rejectWithValue('Failed to load products');
    }
  },
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await productApi.getById(id);
      return data;
    } catch {
      return rejectWithValue('Product not found');
    }
  },
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProductList(state) {
      state.list = [];
      state.page = 0;
      state.hasMore = true;
      state.listStatus = 'idle';
      state.error = null;
    },
    setProductSearch(state, action: { payload: string }) {
      state.search = action.payload;
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
      state.detailStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsPage.pending, (state, action) => {
        state.error = null;
        state.listStatus = action.meta.arg.append ? 'loadingMore' : 'loading';
      })
      .addCase(fetchProductsPage.fulfilled, (state, action) => {
        const { items, page, total, hasMore, totalPages, append } = action.payload;
        state.list = append ? [...state.list, ...items] : items;
        state.page = page;
        state.total = total;
        state.totalPages = totalPages;
        state.hasMore = hasMore;
        state.listStatus = 'idle';
      })
      .addCase(fetchProductsPage.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.error = (action.payload as string) ?? 'Error';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.detailStatus = 'loading';
        state.selectedProduct = null;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailStatus = 'idle';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = (action.payload as string) ?? 'Not found';
      });
  },
});

export const { resetProductList, setProductSearch, clearSelectedProduct } = productSlice.actions;
export const productReducer = productSlice.reducer;

export const selectProductList = (state: { products: ProductState }) => state.products.list;
export const selectProductListStatus = (state: { products: ProductState }) =>
  state.products.listStatus;
export const selectProductHasMore = (state: { products: ProductState }) => state.products.hasMore;
export const selectProductPage = (state: { products: ProductState }) => state.products.page;
export const selectProductTotalPages = (state: { products: ProductState }) =>
  state.products.totalPages;
export const selectSelectedProduct = (state: { products: ProductState }) =>
  state.products.selectedProduct;
export const selectProductDetailStatus = (state: { products: ProductState }) =>
  state.products.detailStatus;
