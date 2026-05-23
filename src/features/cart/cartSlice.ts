import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { CART_STORAGE_KEY } from '@/constants';
import type { CartItem, Product } from '@/types';
import { storage } from '@/utils';

export type CartState = {
  items: CartItem[];
};

const loadCart = (): CartItem[] => storage.get<CartItem[]>(CART_STORAGE_KEY) ?? [];

const persistCart = (items: CartItem[]) => {
  storage.set(CART_STORAGE_KEY, items);
};

const initialState: CartState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
      persistCart(state.items);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
      persistCart(state.items);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find((i) => i.product.id === action.payload.productId);
      if (!item) return;
      if (action.payload.quantity <= 0) {
        state.items = state.items.filter((i) => i.product.id !== action.payload.productId);
      } else {
        item.quantity = action.payload.quantity;
      }
      persistCart(state.items);
    },
    clearCart(state) {
      state.items = [];
      persistCart(state.items);
    },
    hydrateCart(state) {
      state.items = loadCart();
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, hydrateCart } =
  cartSlice.actions;
export const cartReducer = cartSlice.reducer;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
