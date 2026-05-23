import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth/authSlice';
import { cartReducer } from '@/features/cart/cartSlice';
import { notificationsReducer } from '@/features/notifications/notificationsSlice';
import { productReducer } from '@/features/products/productSlice';
import { productsApi } from '@/features/products/productsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    notifications: notificationsReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['notifications/addNotification'],
      },
    }).concat(productsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
