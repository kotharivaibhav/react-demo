import { Link, Navigate, useNavigate } from 'react-router-dom';
import { SignupForm } from '@/components/forms/SignupForm';
import { Button } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useAuth, useToast } from '@/context';
import type { SignupFormValues } from '@/validations/schemas';

export const SignupPage = () => {
  const { signup, googleLogin, isLoading, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  const handleSignup = async (values: SignupFormValues) => {
    try {
      await signup(values.name, values.email, values.password);
      showToast('Account created!', 'success');
      navigate(ROUTES.HOME, { replace: true });
    } catch {
      showToast('Signup failed', 'error');
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin({ email: 'google.user@gmail.com', name: 'Google User' });
      showToast('Signed in with Google', 'success');
      navigate(ROUTES.HOME, { replace: true });
    } catch {
      showToast('Google sign-in failed', 'error');
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-card__title">Create account</h1>
      <p className="auth-card__subtitle">Sign up with email or Google (mock OAuth)</p>

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

      <SignupForm onSubmit={handleSignup} isLoading={isLoading} />

      <p className="auth-card__footer">
        Already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link>
      </p>
      <p className="auth-hint">
        Demo accounts: admin@test.com / admin123 · vendor@test.com / vendor123
      </p>
    </div>
  );
};
