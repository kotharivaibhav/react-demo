import { useCallback, useEffect, useMemo, type ReactNode } from 'react';
import {
  hydrateAuth,
  loginThunk,
  logoutThunk,
  signupThunk,
  googleLoginThunk,
  validateSessionThunk,
  selectAuth,
  selectIsAuthenticated,
} from '@/features/auth';
import { hydrateCart } from '@/features/cart';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { AuthContext } from './authContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    dispatch(hydrateAuth());
    dispatch(hydrateCart());
    dispatch(validateSessionThunk());
  }, [dispatch]);

  const login = useCallback(
    async (email: string, password: string) => {
      await dispatch(loginThunk({ email, password })).unwrap();
    },
    [dispatch],
  );

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      await dispatch(signupThunk({ name, email, password })).unwrap();
    },
    [dispatch],
  );

  const googleLogin = useCallback(
    async (payload?: { email?: string; name?: string }) => {
      await dispatch(googleLoginThunk(payload ?? {})).unwrap();
    },
    [dispatch],
  );

  const logout = useCallback(() => {
    dispatch(logoutThunk());
  }, [dispatch]);

  const value = useMemo(
    () => ({
      user: auth.user,
      isAuthenticated,
      isLoading: auth.isLoading,
      login,
      signup,
      googleLogin,
      logout,
    }),
    [auth.user, auth.isLoading, isAuthenticated, login, signup, googleLogin, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
