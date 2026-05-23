import type { Permission, UserRole } from '@/types';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'products:read',
    'products:manage',
    'orders:read',
    'orders:manage',
    'users:read',
    'users:manage',
    'dashboard:admin',
    'cart:checkout',
  ],
  vendor: ['products:read', 'products:manage', 'orders:read', 'dashboard:vendor', 'cart:checkout'],
  user: ['products:read', 'orders:read', 'cart:checkout'],
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  vendor: 'Vendor',
  user: 'Customer',
};
