import { useMemo, useState } from 'react';

type UsePaginationOptions = {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
};

export const usePagination = ({
  totalItems,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationOptions) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const safePage = Math.min(currentPage, totalPages);

  const paginatedRange = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return { start, end: start + itemsPerPage };
  }, [safePage, itemsPerPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return {
    currentPage: safePage,
    totalPages,
    paginatedRange,
    goToPage,
    nextPage: () => goToPage(safePage + 1),
    prevPage: () => goToPage(safePage - 1),
  };
};
