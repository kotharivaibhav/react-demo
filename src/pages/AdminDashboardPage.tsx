import { PermissionGate } from '@/components/common/PermissionGate';
import { ROLE_LABELS } from '@/constants';
import { selectAuthUser } from '@/features/auth';
import { useAppSelector } from '@/redux/hooks';

export const AdminDashboardPage = () => {
  const user = useAppSelector(selectAuthUser);

  return (
    <div className="profile-card">
      <span className="phase-badge">Admin only</span>
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">
        Welcome, {user?.name} — {ROLE_LABELS.admin}
      </p>

      <PermissionGate permission="users:manage">
        <section className="dashboard-section">
          <h3>User management</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Manage users, roles, and permissions (mock UI).
          </p>
        </section>
      </PermissionGate>

      <PermissionGate permission="products:manage">
        <section className="dashboard-section">
          <h3>Catalog management</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Add, edit, and remove products across all vendors.
          </p>
        </section>
      </PermissionGate>

      <PermissionGate permission="orders:manage">
        <section className="dashboard-section">
          <h3>All orders</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            View and fulfill orders platform-wide.
          </p>
        </section>
      </PermissionGate>
    </div>
  );
};
