import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { hasPermission, hasRole } from '@/features/auth';
import { selectAuthRole, selectIsAuthenticated } from '@/features/auth';
import { useAppSelector } from '@/redux/hooks';
import type { Permission, UserRole } from '@/types';

type RoleRouteProps = {
  roles?: UserRole | UserRole[];
  permission?: Permission;
};

export const RoleRoute = ({ roles, permission }: RoleRouteProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole = useAppSelector(selectAuthRole);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (roles && !hasRole(userRole, roles)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  if (permission && !hasPermission(userRole, permission)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};
