import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEBOUNCE_MS, ITEMS_PER_PAGE } from '@/constants';
import type { ProductCategory, ProductSortField, ProductSortOrder } from '@/types';
import { useDebounce } from './useDebounce';

const parseCategory = (value: string | null): ProductCategory => {
  const valid = ['all', 'electronics', 'audio', 'accessories', 'office'] as const;
  return valid.includes(value as ProductCategory) ? (value as ProductCategory) : 'all';
};

const parseSortBy = (value: string | null): ProductSortField =>
  value === 'price' ? 'price' : 'name';

const parseSortOrder = (value: string | null): ProductSortOrder =>
  value === 'desc' ? 'desc' : 'asc';

export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('q') ?? '';
  const debouncedSearch = useDebounce(search, DEBOUNCE_MS);
  const category = parseCategory(searchParams.get('category'));
  const sortBy = parseSortBy(searchParams.get('sortBy'));
  const sortOrder = parseSortOrder(searchParams.get('sortOrder'));
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));

  const apiParams = useMemo(
    () => ({
      search: debouncedSearch,
      category,
      sortBy,
      sortOrder,
      page,
      limit: ITEMS_PER_PAGE,
    }),
    [debouncedSearch, category, sortBy, sortOrder, page],
  );

  const setFilter = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (!value || (key !== 'q' && value === 'all')) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        if (key !== 'page') next.delete('page');
        return next;
      });
    },
    [setSearchParams],
  );

  const setSearch = useCallback((value: string) => setFilter('q', value), [setFilter]);
  const setCategory = useCallback(
    (value: ProductCategory) => setFilter('category', value === 'all' ? '' : value),
    [setFilter],
  );
  const setSortBy = useCallback(
    (value: ProductSortField) => setFilter('sortBy', value),
    [setFilter],
  );
  const setSortOrder = useCallback(
    (value: ProductSortOrder) => setFilter('sortOrder', value),
    [setFilter],
  );
  const setPage = useCallback((p: number) => setFilter('page', String(p)), [setFilter]);

  return {
    search,
    debouncedSearch,
    category,
    sortBy,
    sortOrder,
    page,
    apiParams,
    setSearch,
    setCategory,
    setSortBy,
    setSortOrder,
    setPage,
  };
};
