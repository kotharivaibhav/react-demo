import type { ProductCategory } from '@/types';

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'all', label: 'All categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'audio', label: 'Audio' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'office', label: 'Office' },
];
