import { useEffect, type ReactNode } from 'react';
import {
  addNotification,
  addOrderUpdate,
  setSocketConnected,
  updateStock,
} from '@/features/notifications/notificationsSlice';
import { useAppDispatch } from '@/redux/hooks';
import { socketService } from '@/services/socket/socketService';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    socketService.connect();

    const unsubConnect = socketService.on('connect', () => {
      dispatch(setSocketConnected(true));
    });
    const unsubDisconnect = socketService.on('disconnect', () => {
      dispatch(setSocketConnected(false));
    });
    const unsubNotification = socketService.on('notification', (payload) => {
      dispatch(addNotification(payload));
    });
    const unsubOrder = socketService.on('order:update', (payload) => {
      dispatch(addOrderUpdate(payload));
    });
    const unsubStock = socketService.on('stock:update', (payload) => {
      dispatch(updateStock(payload));
    });

    return () => {
      unsubConnect();
      unsubDisconnect();
      unsubNotification();
      unsubOrder();
      unsubStock();
      socketService.disconnect();
    };
  }, [dispatch]);

  return <>{children}</>;
};
