import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAuth } from '@/context';

type PublicRouteProps = {
  /** When true, redirects authenticated users away (e.g. login page) */
  guestOnly?: boolean;
};

export const PublicRoute = ({ guestOnly = false }: PublicRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (guestOnly && isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};
