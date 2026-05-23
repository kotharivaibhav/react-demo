import { mockProducts } from '@/api/mockProducts';
import type {
  PaginatedProducts,
  Product,
  ProductCategory,
  ProductSortField,
  ProductSortOrder,
} from '@/types';

export const filterAndSortProducts = (
  search: string,
  category: ProductCategory,
  sortBy: ProductSortField,
  sortOrder: ProductSortOrder,
): Product[] => {
  let items = [...mockProducts];

  const q = search.trim().toLowerCase();
  if (q) {
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }

  if (category && category !== 'all') {
    items = items.filter((p) => p.category === category);
  }

  items.sort((a, b) => {
    const dir = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'price') return (a.price - b.price) * dir;
    return a.name.localeCompare(b.name) * dir;
  });

  return items;
};

export const paginateProducts = (
  items: Product[],
  page: number,
  limit: number,
): PaginatedProducts => {
  const start = (page - 1) * limit;
  const slice = items.slice(start, start + limit);
  const totalPages = Math.max(1, Math.ceil(items.length / limit));
  return {
    items: slice,
    total: items.length,
    page,
    limit,
    hasMore: start + limit < items.length,
    totalPages,
  };
};
