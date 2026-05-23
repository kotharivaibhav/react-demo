import { Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { createBrowserRouter, Navigate, RouterProvider, useParams } from 'react-router-dom';
import { RouteFallback } from '@/components/common/RouteFallback';
import { ROUTES } from '@/constants';
import { MainLayout, AuthLayout, AccountLayout } from '@/layouts';
import {
  HomePage,
  ProductDetailsPage,
  LoginPage,
  SignupPage,
  CartPage,
  CheckoutPage,
  ProfilePage,
  AccountSettingsPage,
  AdminDashboardPage,
  VendorDashboardPage,
  NotFoundPage,
} from './lazyPages';
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import { RoleRoute } from './RoleRoute';

const withSuspense = (Page: LazyExoticComponent<ComponentType>) => (
  <Suspense fallback={<RouteFallback />}>
    <Page />
  </Suspense>
);

const ProductDetailsRoute = () => {
  const { productId } = useParams<{ productId: string }>();
  return (
    <Suspense fallback={<RouteFallback />}>
      <ProductDetailsPage key={productId} />
    </Suspense>
  );
};

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          { path: ROUTES.HOME, element: withSuspense(HomePage) },
          { path: ROUTES.PRODUCT_DETAILS, element: <ProductDetailsRoute /> },
        ],
      },
      {
        element: <PublicRoute guestOnly />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: ROUTES.LOGIN, element: withSuspense(LoginPage) },
              { path: ROUTES.SIGNUP, element: withSuspense(SignupPage) },
            ],
          },
        ],
      },
      {
        element: <PrivateRoute />,
        children: [
          { path: ROUTES.CART, element: withSuspense(CartPage) },
          { path: ROUTES.CHECKOUT, element: withSuspense(CheckoutPage) },
          {
            path: ROUTES.ACCOUNT,
            element: <AccountLayout />,
            children: [
              { index: true, element: <Navigate to="profile" replace /> },
              { path: 'profile', element: withSuspense(ProfilePage) },
              { path: 'settings', element: withSuspense(AccountSettingsPage) },
            ],
          },
        ],
      },
      {
        element: <RoleRoute roles="admin" permission="dashboard:admin" />,
        children: [{ path: ROUTES.ADMIN, element: withSuspense(AdminDashboardPage) }],
      },
      {
        element: <RoleRoute roles="vendor" permission="dashboard:vendor" />,
        children: [{ path: ROUTES.VENDOR, element: withSuspense(VendorDashboardPage) }],
      },
      { path: '*', element: withSuspense(NotFoundPage) },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
