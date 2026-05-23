import { NavLink, Outlet } from 'react-router-dom';
import { ROUTES } from '@/constants';

export const AccountLayout = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `account-sidebar__link${isActive ? ' account-sidebar__link--active' : ''}`;

  return (
    <div>
      <h1 className="page-title">My Account</h1>
      <p className="page-subtitle">Nested routes — profile & settings</p>

      <div className="account-layout">
        <aside className="account-sidebar">
          <NavLink to={ROUTES.PROFILE} className={linkClass}>
            Profile
          </NavLink>
          <NavLink to={ROUTES.ACCOUNT_SETTINGS} className={linkClass}>
            Settings
          </NavLink>
        </aside>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
