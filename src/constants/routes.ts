export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PRODUCT_DETAILS: '/products/:productId',
  productDetails: (productId: string) => `/products/${productId}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ACCOUNT: '/account',
  PROFILE: '/account/profile',
  ACCOUNT_SETTINGS: '/account/settings',
  ADMIN: '/admin',
  VENDOR: '/vendor',
} as const;
