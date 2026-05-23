import { NavLink, Link } from 'react-router-dom';
import { APP_NAME, ROUTES } from '@/constants';
import { useAuth } from '@/context';
import { NotificationBell } from '@/components/common/NotificationBell';
import { PermissionGate } from '@/components/common/PermissionGate';
import { selectCartCount } from '@/features/cart';
import { useAppSelector } from '@/redux/hooks';
import { Button } from '@/components/ui';

export const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const cartCount = useAppSelector(selectCartCount);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `app-nav__link${isActive ? ' app-nav__link--active' : ''}`;

  return (
    <header className="app-header">
      <Link to={ROUTES.HOME} className="app-header__brand">
        {APP_NAME}
      </Link>

      <nav className="app-nav">
        <NotificationBell />
        <NavLink to={ROUTES.HOME} className={navLinkClass} end>
          Home
        </NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to={ROUTES.CART} className={navLinkClass}>
              Cart{cartCount > 0 ? ` (${cartCount})` : ''}
            </NavLink>
            <NavLink to={ROUTES.PROFILE} className={navLinkClass}>
              Profile
            </NavLink>
            <PermissionGate permission="dashboard:admin">
              <NavLink to={ROUTES.ADMIN} className={navLinkClass}>
                Admin
              </NavLink>
            </PermissionGate>
            <PermissionGate permission="dashboard:vendor">
              <NavLink to={ROUTES.VENDOR} className={navLinkClass}>
                Vendor
              </NavLink>
            </PermissionGate>
            <Button variant="secondary" size="sm" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <NavLink to={ROUTES.LOGIN} className={navLinkClass}>
              Login
            </NavLink>
            <NavLink to={ROUTES.SIGNUP} className={navLinkClass}>
              Sign up
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
};
