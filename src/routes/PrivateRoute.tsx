import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAuth } from '@/context';

export const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
