import { memo, useCallback, useState } from 'react';
import { Button } from '@/components/ui';
import {
  clearNotifications,
  markAllRead,
  markNotificationRead,
  selectIsSocketConnected,
  selectNotifications,
  selectOrderUpdates,
  selectUnreadCount,
} from '@/features/notifications/notificationsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { cn } from '@/utils';

export const NotificationBell = memo(() => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const orders = useAppSelector(selectOrderUpdates);
  const unread = useAppSelector(selectUnreadCount);
  const connected = useAppSelector(selectIsSocketConnected);
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <div className="notification-bell">
      <button
        type="button"
        className="notification-bell__trigger"
        onClick={toggle}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
      >
        🔔
        {unread > 0 && <span className="notification-bell__badge">{unread}</span>}
        <span
          className={cn('notification-bell__status', connected && 'notification-bell__status--on')}
          title={connected ? 'Socket connected' : 'Socket disconnected'}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="notification-bell__backdrop"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />
          <div className="notification-panel">
            <div className="notification-panel__header">
              <h3>Realtime</h3>
              <span className="phase-badge">{connected ? 'Live' : 'Offline'}</span>
            </div>

            <div className="notification-panel__actions">
              <Button variant="ghost" size="sm" onClick={() => dispatch(markAllRead())}>
                Mark all read
              </Button>
              <Button variant="ghost" size="sm" onClick={() => dispatch(clearNotifications())}>
                Clear
              </Button>
            </div>

            <div className="notification-panel__section">
              <h4>Notifications</h4>
              {notifications.length === 0 ? (
                <p className="notification-panel__empty">Waiting for socket events…</p>
              ) : (
                <ul className="notification-list">
                  {notifications.slice(0, 8).map((n) => (
                    <li
                      key={n.id}
                      className={cn('notification-item', !n.read && 'notification-item--unread')}
                      onClick={() => dispatch(markNotificationRead(n.id))}
                    >
                      <strong>{n.title}</strong>
                      <span>{n.message}</span>
                      <time>{new Date(n.createdAt).toLocaleTimeString()}</time>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="notification-panel__section">
              <h4>Order updates</h4>
              {orders.length === 0 ? (
                <p className="notification-panel__empty">No order events yet</p>
              ) : (
                <ul className="notification-list">
                  {orders.slice(0, 5).map((o) => (
                    <li key={`${o.orderId}-${o.status}`} className="notification-item">
                      <strong>{o.orderId}</strong>
                      <span>{o.message}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

NotificationBell.displayName = 'NotificationBell';
