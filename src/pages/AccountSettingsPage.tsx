import { Button } from '@/components/ui';
import { EXPIRED_ACCESS_TOKEN, tokenStorage } from '@/api';
import { useToast } from '@/context';
import { useGetProductByIdQuery } from '@/features/products';

export const AccountSettingsPage = () => {
  const { showToast } = useToast();
  const { refetch, isFetching } = useGetProductByIdQuery('1');

  const simulateExpiredToken = () => {
    const tokens = tokenStorage.get();
    if (!tokens) {
      showToast('Login first to get tokens', 'warning');
      return;
    }
    tokenStorage.set({ ...tokens, accessToken: EXPIRED_ACCESS_TOKEN });
    showToast('Access token set to expired — refetch to trigger refresh flow', 'info');
  };

  const testRefreshFlow = async () => {
    try {
      await refetch();
      showToast('Request succeeded (token may have been refreshed)', 'success');
    } catch {
      showToast('Request failed — check console', 'error');
    }
  };

  return (
    <div className="profile-card">
      <h2 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Account Settings</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
        Phase 2 — test Axios interceptors & token refresh (mock API).
      </p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          alignItems: 'flex-start',
        }}
      >
        <Button variant="secondary" size="sm" onClick={simulateExpiredToken}>
          1. Simulate expired access token
        </Button>
        <Button variant="primary" size="sm" onClick={testRefreshFlow} isLoading={isFetching}>
          2. Refetch product (triggers 401 → refresh → retry)
        </Button>
      </div>
    </div>
  );
};
