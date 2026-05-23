import { io, type Socket } from 'socket.io-client';
import { mockProducts } from '@/api/mockProducts';
import { mockStockStore } from '@/api/mock/mockStockStore';
import { env } from '@/config';
import type {
  OrderUpdateEvent,
  RealtimeNotification,
  SocketEventMap,
  StockUpdateEvent,
} from '@/types/realtime';

type EventHandler<K extends keyof SocketEventMap> = (payload: SocketEventMap[K]) => void;

const ORDER_STATUSES: OrderUpdateEvent['status'][] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
];

/**
 * Mock Socket.io client — simulates realtime events in-browser when no server is running.
 * Set VITE_SOCKET_URL to connect to a real Socket.io server instead.
 */
class SocketService {
  private socket: Socket | null = null;
  private mockMode = true;
  private mockTimer: ReturnType<typeof setInterval> | null = null;
  private listeners = new Map<string, Set<EventHandler<keyof SocketEventMap>>>();

  connect(): void {
    if (this.socket?.connected) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL as string | undefined;

    if (socketUrl && socketUrl !== 'mock') {
      this.mockMode = false;
      this.socket = io(socketUrl, { transports: ['websocket'], autoConnect: true });
      this.bindSocketEvents();
      return;
    }

    this.mockMode = true;
    this.emit('connect');
    this.startMockEvents();
  }

  disconnect(): void {
    if (this.mockTimer) {
      clearInterval(this.mockTimer);
      this.mockTimer = null;
    }
    this.socket?.disconnect();
    this.socket = null;
    this.emit('disconnect');
  }

  on<K extends keyof SocketEventMap>(event: K, handler: EventHandler<K>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler as EventHandler<keyof SocketEventMap>);
    return () => this.off(event, handler);
  }

  off<K extends keyof SocketEventMap>(event: K, handler: EventHandler<K>): void {
    this.listeners.get(event)?.delete(handler as EventHandler<keyof SocketEventMap>);
  }

  emitLocal<K extends keyof SocketEventMap>(event: K, payload: SocketEventMap[K]): void {
    this.emit(event, payload);
  }

  get isConnected(): boolean {
    return this.mockMode ? Boolean(this.mockTimer) : Boolean(this.socket?.connected);
  }

  get mode(): 'mock' | 'live' {
    return this.mockMode ? 'mock' : 'live';
  }

  private bindSocketEvents(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => this.emit('connect'));
    this.socket.on('disconnect', () => this.emit('disconnect'));
    this.socket.on('notification', (payload: RealtimeNotification) =>
      this.emit('notification', payload),
    );
    this.socket.on('order:update', (payload: OrderUpdateEvent) =>
      this.emit('order:update', payload),
    );
    this.socket.on('stock:update', (payload: StockUpdateEvent) =>
      this.emit('stock:update', payload),
    );
  }

  private emit<K extends keyof SocketEventMap>(event: K, payload?: SocketEventMap[K]): void {
    this.listeners.get(event)?.forEach((handler) => {
      handler(payload as SocketEventMap[K]);
    });
  }

  private startMockEvents(): void {
    if (this.mockTimer) return;
    mockStockStore.init(mockProducts);

    this.mockTimer = setInterval(() => {
      const roll = Math.random();
      if (roll < 0.4) this.emitMockStock();
      else if (roll < 0.7) this.emitMockOrder();
      else this.emitMockNotification();
    }, 8000);
  }

  private emitMockStock(): void {
    const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    if (!product) return;
    const delta = Math.random() > 0.5 ? -1 : 1;
    const stock = mockStockStore.set(product.id, mockStockStore.get(product.id) + delta * 3);
    const payload: StockUpdateEvent = {
      productId: product.id,
      productName: product.name,
      stock,
    };
    this.emit('stock:update', payload);
    this.emit('notification', {
      id: crypto.randomUUID(),
      title: 'Stock update',
      message: `${product.name}: ${stock} units left`,
      type: 'stock',
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  private emitMockOrder(): void {
    const status = ORDER_STATUSES[Math.floor(Math.random() * ORDER_STATUSES.length)];
    const orderId = `ORD-${1000 + Math.floor(Math.random() * 9000)}`;
    const payload: OrderUpdateEvent = {
      orderId,
      status,
      message: `Order ${orderId} is now ${status}`,
    };
    this.emit('order:update', payload);
    this.emit('notification', {
      id: crypto.randomUUID(),
      title: 'Order update',
      message: payload.message,
      type: 'order',
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  private emitMockNotification(): void {
    this.emit('notification', {
      id: crypto.randomUUID(),
      title: 'System',
      message: `Realtime ping from ${env.appName} (mock socket)`,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString(),
    });
  }
}

export const socketService = new SocketService();
