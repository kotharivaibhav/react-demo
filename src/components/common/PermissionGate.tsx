import type { ReactNode } from 'react';
import { hasPermission, hasRole } from '@/features/auth';
import { selectAuthRole } from '@/features/auth';
import { useAppSelector } from '@/redux/hooks';
import type { Permission, UserRole } from '@/types';

type PermissionGateProps = {
  permission?: Permission;
  permissions?: Permission[];
  role?: UserRole | UserRole[];
  fallback?: ReactNode;
  children: ReactNode;
};

export const PermissionGate = ({
  permission,
  permissions = [],
  role,
  fallback = null,
  children,
}: PermissionGateProps) => {
  const userRole = useAppSelector(selectAuthRole);

  const needsPermission = Boolean(permission) || permissions.length > 0;
  const allowedByPermission =
    !needsPermission ||
    (permission && hasPermission(userRole, permission)) ||
    permissions.some((p) => hasPermission(userRole, p));

  const allowedByRole = role ? hasRole(userRole, role) : true;

  const allowed = allowedByPermission && allowedByRole;

  return allowed ? <>{children}</> : <>{fallback}</>;
};
