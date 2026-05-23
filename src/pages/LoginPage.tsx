import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/forms/LoginForm';
import { Button } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useAuth, useToast } from '@/context';
import type { LoginFormValues } from '@/validations/schemas';

export const LoginPage = () => {
  const { login, googleLogin, isLoading, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.HOME;

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      showToast('Welcome back!', 'success');
      navigate(from, { replace: true });
    } catch {
      showToast('Login failed. Check credentials.', 'error');
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      showToast('Signed in with Google', 'success');
      navigate(from, { replace: true });
    } catch {
      showToast('Google sign-in failed', 'error');
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-card__title">Sign in</h1>
      <p className="auth-card__subtitle">JWT auth with refresh token (mock API)</p>

      <Button
        type="button"
        variant="secondary"
        className="btn--lg"
        style={{ width: '100%', marginBottom: '1rem' }}
        onClick={handleGoogle}
        isLoading={isLoading}
      >
        Continue with Google
      </Button>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />

      <p className="auth-card__footer">
        No account? <Link to={ROUTES.SIGNUP}>Sign up</Link>
      </p>
      <p className="auth-hint">admin@test.com / admin123 · vendor@test.com / vendor123</p>
    </div>
  );
};
