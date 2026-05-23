import { Loader } from '@/components/ui';

export const RouteFallback = () => (
  <div className="route-fallback">
    <Loader />
    <p>Loading page…</p>
  </div>
);
