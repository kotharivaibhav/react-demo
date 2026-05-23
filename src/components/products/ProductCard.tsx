import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { LiveStockBadge } from '@/components/common/LiveStockBadge';
import { ROUTES } from '@/constants';
import type { Product } from '@/types';
import { formatCurrency } from '@/utils';

type ProductCardProps = {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
};

export const ProductCard = memo(({ product, onQuickView, onAddToCart }: ProductCardProps) => {
  const handleQuickView = useCallback(() => onQuickView(product), [onQuickView, product]);
  const handleAddToCart = useCallback(() => onAddToCart(product), [onAddToCart, product]);

  return (
    <article className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-card__image"
        loading="lazy"
        decoding="async"
      />
      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price">{formatCurrency(product.price)}</p>
        <LiveStockBadge productId={product.id} fallbackStock={product.stock} />
        <div className="product-card__actions">
          <Link to={ROUTES.productDetails(product.id)}>
            <Button variant="primary" size="sm">
              View
            </Button>
          </Link>
          <Button variant="secondary" size="sm" onClick={handleQuickView}>
            Quick view
          </Button>
          <Button variant="ghost" size="sm" onClick={handleAddToCart}>
            + Cart
          </Button>
        </div>
      </div>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';
