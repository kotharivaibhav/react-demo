import { memo, useCallback, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

const ROW_HEIGHT = 340;
const GAP = 24;

type VirtualProductGridProps = {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
};

export const VirtualProductGrid = memo(
  ({ products, onQuickView, onAddToCart }: VirtualProductGridProps) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const columns = useMemo(() => {
      const width = parentRef.current?.clientWidth ?? 1200;
      if (width < 640) return 1;
      if (width < 960) return 2;
      return 3;
    }, []);

    const rowCount = Math.ceil(products.length / columns);

    const virtualizer = useVirtualizer({
      count: rowCount,
      getScrollElement: () => parentRef.current,
      estimateSize: () => ROW_HEIGHT + GAP,
      overscan: 2,
    });

    const getRowProducts = useCallback(
      (rowIndex: number) => {
        const start = rowIndex * columns;
        return products.slice(start, start + columns);
      },
      [products, columns],
    );

    return (
      <div ref={parentRef} className="virtual-scroll-container">
        <div className="virtual-scroll-inner" style={{ height: `${virtualizer.getTotalSize()}px` }}>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const rowProducts = getRowProducts(virtualRow.index);
            return (
              <div
                key={virtualRow.key}
                className="virtual-scroll-row"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}
              >
                {rowProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

VirtualProductGrid.displayName = 'VirtualProductGrid';
