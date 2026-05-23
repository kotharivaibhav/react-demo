import { useCallback, useEffect, useRef } from 'react';

type UseInfiniteScrollOptions = {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  /** IntersectionObserver rootMargin — load before user hits bottom */
  rootMargin?: string;
  threshold?: number;
};

/**
 * Observes a sentinel element and calls onLoadMore when it enters the viewport.
 */
export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = '120px',
  threshold = 0,
}: UseInfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  const stableLoadMore = useCallback(() => {
    onLoadMoreRef.current();
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && !isLoading) {
          stableLoadMore();
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoading, rootMargin, threshold, stableLoadMore]);

  return { sentinelRef };
};
