import { lazy } from 'react';

/** Code-split route chunks — each page loads on demand */
export const HomePage = lazy(() =>
  import('@/pages/HomePage').then((m) => ({ default: m.HomePage })),
);
export const ProductDetailsPage = lazy(() =>
  import('@/pages/ProductDetailsPage').then((m) => ({ default: m.ProductDetailsPage })),
);
export const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
);
export const SignupPage = lazy(() =>
  import('@/pages/SignupPage').then((m) => ({ default: m.SignupPage })),
);
export const CartPage = lazy(() =>
  import('@/pages/CartPage').then((m) => ({ default: m.CartPage })),
);
export const CheckoutPage = lazy(() =>
  import('@/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })),
);
export const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
export const AccountSettingsPage = lazy(() =>
  import('@/pages/AccountSettingsPage').then((m) => ({ default: m.AccountSettingsPage })),
);
export const AdminDashboardPage = lazy(() =>
  import('@/pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
);
export const VendorDashboardPage = lazy(() =>
  import('@/pages/VendorDashboardPage').then((m) => ({ default: m.VendorDashboardPage })),
);
export const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);
