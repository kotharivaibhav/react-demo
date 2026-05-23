import { Link, useParams } from 'react-router-dom';
import { LiveStockBadge } from '@/components/common/LiveStockBadge';
import { Button, Loader } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useToast } from '@/context';
import { addToCart } from '@/features/cart';
import { useGetProductByIdQuery } from '@/features/products';
import { useAppDispatch } from '@/redux/hooks';
import { formatCurrency } from '@/utils';

export const ProductDetailsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(productId ?? '', {
    skip: !productId,
  });

  if (isLoading) return <Loader />;

  if (isError || !product) {
    return (
      <div>
        <h1 className="page-title">Product not found</h1>
        <p className="page-subtitle">No product exists for ID: {productId}</p>
        <Link to={ROUTES.HOME}>
          <Button variant="secondary">Back to home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to={ROUTES.HOME}
        style={{ fontSize: '0.875rem', marginBottom: '1rem', display: 'inline-block' }}
      >
        ← Back to products
      </Link>

      <p className="phase-badge">RTK Query — cached API call</p>

      <div className="product-detail">
        <img src={product.image} alt={product.name} className="product-detail__image" />
        <div>
          <h1 className="page-title">{product.name}</h1>
          <p className="product-detail__price">{formatCurrency(product.price)}</p>
          <LiveStockBadge productId={product.id} fallbackStock={product.stock} />
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            {product.description}
          </p>
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text-muted)',
              marginBottom: '1rem',
            }}
          >
            Dynamic route param: <code>{productId}</code>
          </p>
          <Button
            onClick={() => {
              dispatch(addToCart({ product }));
              showToast(`${product.name} added to cart`, 'success');
            }}
          >
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
};
