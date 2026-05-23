export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    GOOGLE: '/auth/google',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
  },
  PRODUCTS: {
    LIST: '/products',
    ALL: '/products/all',
    BY_ID: (id: string) => `/products/${id}`,
  },
  CART: {
    SYNC: '/cart/sync',
  },
  ORDERS: {
    CHECKOUT: '/orders/checkout',
  },
} as const;
