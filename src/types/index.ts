import type { ReactNode } from 'react';

export type {
  User,
  UserRole,
  Permission,
  Address,
  AuthTokens,
  JwtPayload,
  LoginResponse,
  SignupPayload,
} from './auth';

export type {
  Product,
  ProductCategory,
  ProductSortField,
  ProductSortOrder,
  PaginatedProducts,
  ProductFilters,
} from './product';

import type { Product } from './product';

export type CartItem = {
  product: Product;
  quantity: number;
};

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastMessage = {
  id: string;
  type: ToastType;
  message: string;
};

export type {
  RealtimeNotification,
  OrderUpdateEvent,
  StockUpdateEvent,
  SocketEventMap,
} from './realtime';

export type TableColumn<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
};
