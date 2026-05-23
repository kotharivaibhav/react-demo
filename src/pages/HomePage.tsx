import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductFiltersBar } from '@/components/common/ProductFiltersBar';
import { VirtualProductGrid } from '@/components/products/VirtualProductGrid';
import { Button, Loader, Modal, Pagination } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useToast } from '@/context';
import { addToCart } from '@/features/cart';
import { useGetAllProductsQuery, useGetProductsQuery } from '@/features/products/productsApi';
import { useProductFilters } from '@/hooks';
import { useAppDispatch } from '@/redux/hooks';
import type { Product } from '@/types';
import { formatCurrency } from '@/utils';
import { ProductCard } from '@/components/products/ProductCard';

type ViewMode = 'pagination' | 'virtual';

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const { apiParams, page, setPage } = useProductFilters();
  const { showToast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('pagination');

  const {
    data: paginatedData,
    isLoading: paginatedLoading,
    isFetching,
  } = useGetProductsQuery(apiParams, { skip: viewMode === 'virtual' });

  const { data: allProducts = [], isLoading: allLoading } = useGetAllProductsQuery(undefined, {
    skip: viewMode === 'pagination',
  });

  const products = viewMode === 'virtual' ? allProducts : (paginatedData?.items ?? []);
  const totalPages = paginatedData?.totalPages ?? 1;
  const isLoading = viewMode === 'virtual' ? allLoading : paginatedLoading;

  const filteredVirtualProducts = useMemo(() => {
    if (viewMode !== 'virtual') return [];
    let list = [...allProducts];
    const q = apiParams.search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.includes(q),
      );
    }
    if (apiParams.category !== 'all') {
      list = list.filter((p) => p.category === apiParams.category);
    }
    const dir = apiParams.sortOrder === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      if (apiParams.sortBy === 'price') return (a.price - b.price) * dir;
      return a.name.localeCompare(b.name) * dir;
    });
    return list;
  }, [viewMode, allProducts, apiParams]);

  const handleAddToCart = useCallback(
    (product: Product) => {
      dispatch(addToCart({ product }));
      showToast(`Added ${product.name} to cart`, 'success');
      setSelectedProduct(null);
    },
    [dispatch, showToast],
  );

  const handleQuickView = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  if (isLoading && products.length === 0) return <Loader />;

  return (
    <div>
      <h1 className="page-title">Products</h1>
      <p className="page-subtitle">
        Phase 4 — lazy routes, memoization, virtual scroll, RTK Query + Redis mock cache
      </p>

      <div className="view-mode-toggle">
        <Button
          variant={viewMode === 'pagination' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setViewMode('pagination')}
        >
          Pagination + RTK cache
        </Button>
        <Button
          variant={viewMode === 'virtual' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setViewMode('virtual')}
        >
          Virtual scroll
        </Button>
        {isFetching && viewMode === 'pagination' && (
          <span className="cache-indicator">Refreshing cache…</span>
        )}
      </div>

      <ProductFiltersBar />

      {viewMode === 'virtual' ? (
        <VirtualProductGrid
          products={filteredVirtualProducts}
          onQuickView={handleQuickView}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={handleQuickView}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
          {products.length === 0 && !isLoading && (
            <p className="cart-empty">No products match your filters.</p>
          )}
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name ?? ''}
        footer={
          selectedProduct && (
            <Link to={ROUTES.productDetails(selectedProduct.id)}>
              <Button onClick={() => setSelectedProduct(null)}>Full details</Button>
            </Link>
          )
        }
      >
        {selectedProduct && (
          <>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              style={{ borderRadius: 'var(--radius)', marginBottom: '1rem' }}
              loading="lazy"
            />
            <p>{selectedProduct.description}</p>
            <p className="product-detail__price">{formatCurrency(selectedProduct.price)}</p>
            <Button onClick={() => handleAddToCart(selectedProduct)}>Add to cart</Button>
          </>
        )}
      </Modal>
    </div>
  );
};
