export type ProductCategory = 'electronics' | 'accessories' | 'audio' | 'office' | 'all';

export type ProductSortField = 'name' | 'price';
export type ProductSortOrder = 'asc' | 'desc';

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: ProductCategory;
  stock: number;
};

export type PaginatedProducts = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
};

export type ProductFilters = {
  search: string;
  category: ProductCategory;
  sortBy: ProductSortField;
  sortOrder: ProductSortOrder;
  page: number;
  limit: number;
};
