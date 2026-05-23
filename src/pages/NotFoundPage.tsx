import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { ROUTES } from '@/constants';

export const NotFoundPage = () => (
  <div style={{ textAlign: 'center', padding: '4rem 0' }}>
    <h1 className="page-title">404</h1>
    <p className="page-subtitle">Page not found</p>
    <Link to={ROUTES.HOME}>
      <Button>Go home</Button>
    </Link>
  </div>
);
