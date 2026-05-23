import { memo } from 'react';
import { selectLiveStock } from '@/features/notifications/notificationsSlice';
import { useAppSelector } from '@/redux/hooks';
import { cn } from '@/utils';

type LiveStockBadgeProps = {
  productId: string;
  fallbackStock: number;
};

export const LiveStockBadge = memo(({ productId, fallbackStock }: LiveStockBadgeProps) => {
  const liveStock = useAppSelector(selectLiveStock);
  const stock = liveStock[productId] ?? fallbackStock;
  const low = stock <= 10;

  return (
    <span className={cn('stock-badge', low && 'stock-badge--low')}>
      {stock <= 0 ? 'Out of stock' : `${stock} in stock`}
    </span>
  );
});

LiveStockBadge.displayName = 'LiveStockBadge';
