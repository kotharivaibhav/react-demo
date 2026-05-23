import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OrderUpdateEvent, RealtimeNotification, StockUpdateEvent } from '@/types/realtime';
import type { RootState } from '@/redux/store';

export type NotificationsState = {
  items: RealtimeNotification[];
  orders: OrderUpdateEvent[];
  stockByProductId: Record<string, number>;
  isSocketConnected: boolean;
};

const initialState: NotificationsState = {
  items: [],
  orders: [],
  stockByProductId: {},
  isSocketConnected: false,
};

const MAX_NOTIFICATIONS = 50;

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setSocketConnected(state, action: PayloadAction<boolean>) {
      state.isSocketConnected = action.payload;
    },
    addNotification(state, action: PayloadAction<RealtimeNotification>) {
      state.items = [action.payload, ...state.items].slice(0, MAX_NOTIFICATIONS);
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) item.read = true;
    },
    markAllRead(state) {
      state.items.forEach((n) => {
        n.read = true;
      });
    },
    clearNotifications(state) {
      state.items = [];
    },
    addOrderUpdate(state, action: PayloadAction<OrderUpdateEvent>) {
      state.orders = [action.payload, ...state.orders].slice(0, 20);
    },
    updateStock(state, action: PayloadAction<StockUpdateEvent>) {
      state.stockByProductId[action.payload.productId] = action.payload.stock;
    },
  },
});

export const {
  setSocketConnected,
  addNotification,
  markNotificationRead,
  markAllRead,
  clearNotifications,
  addOrderUpdate,
  updateStock,
} = notificationsSlice.actions;

export const notificationsReducer = notificationsSlice.reducer;

export const selectNotifications = (state: RootState) => state.notifications.items;
export const selectUnreadCount = (state: RootState) =>
  state.notifications.items.filter((n) => !n.read).length;
export const selectOrderUpdates = (state: RootState) => state.notifications.orders;
export const selectLiveStock = (state: RootState) => state.notifications.stockByProductId;
export const selectIsSocketConnected = (state: RootState) => state.notifications.isSocketConnected;
