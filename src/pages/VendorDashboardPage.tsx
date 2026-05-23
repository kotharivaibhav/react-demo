import { PermissionGate } from '@/components/common/PermissionGate';
import { ROLE_LABELS } from '@/constants';
import { selectAuthUser } from '@/features/auth';
import { useAppSelector } from '@/redux/hooks';

export const VendorDashboardPage = () => {
  const user = useAppSelector(selectAuthUser);

  return (
    <div className="profile-card">
      <span className="phase-badge">Vendor only</span>
      <h1 className="page-title">Vendor Dashboard</h1>
      <p className="page-subtitle">
        Welcome, {user?.name} — {ROLE_LABELS.vendor}
      </p>

      <PermissionGate permission="products:manage">
        <section className="dashboard-section">
          <h3>My products</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Manage your product listings and inventory.
          </p>
        </section>
      </PermissionGate>

      <PermissionGate permission="orders:read">
        <section className="dashboard-section">
          <h3>Orders</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            View orders containing your products.
          </p>
        </section>
      </PermissionGate>
    </div>
  );
};
