import { ROLE_PERMISSIONS } from '@/constants/roles';
import type { Permission, UserRole } from '@/types';

export const hasPermission = (role: UserRole | undefined, permission: Permission): boolean => {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
};

export const hasAnyPermission = (role: UserRole | undefined, permissions: Permission[]): boolean =>
  permissions.some((p) => hasPermission(role, p));

export const hasRole = (role: UserRole | undefined, allowed: UserRole | UserRole[]): boolean => {
  if (!role) return false;
  const roles = Array.isArray(allowed) ? allowed : [allowed];
  return roles.includes(role);
};
