export type RealtimeNotification = {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'stock' | 'system';
  read: boolean;
  createdAt: string;
};

export type OrderUpdateEvent = {
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  message: string;
};

export type StockUpdateEvent = {
  productId: string;
  productName: string;
  stock: number;
};

export type SocketEventMap = {
  notification: RealtimeNotification;
  'order:update': OrderUpdateEvent;
  'stock:update': StockUpdateEvent;
  connect: void;
  disconnect: void;
};
