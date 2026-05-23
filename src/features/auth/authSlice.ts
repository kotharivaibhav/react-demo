import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AUTH_STORAGE_KEY, TOKEN_STORAGE_KEY } from '@/constants';
import { authApi } from '@/services/authApi';
import { tokenStorage } from '@/api/tokenStorage';
import { isJwtExpired } from '@/utils/jwt';
import type { AuthTokens, User } from '@/types';
import { storage } from '@/utils';
import type { RootState } from '@/redux/store';

export type AuthState = {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  error: string | null;
  sessionChecked: boolean;
};

const initialState: AuthState = {
  user: storage.get<User>(AUTH_STORAGE_KEY),
  tokens: storage.get<AuthTokens>(TOKEN_STORAGE_KEY),
  isLoading: false,
  error: null,
  sessionChecked: false,
};

const persistSession = (user: User, tokens: AuthTokens) => {
  storage.set(AUTH_STORAGE_KEY, user);
  tokenStorage.set(tokens);
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await authApi.login(email, password);
      persistSession(data.user, data.tokens);
      return data;
    } catch {
      return rejectWithValue('Invalid email or password');
    }
  },
);

export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (
    { name, email, password }: { name: string; email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await authApi.signup(name, email, password);
      persistSession(data.user, data.tokens);
      return data;
    } catch {
      return rejectWithValue('Signup failed. Email may already exist.');
    }
  },
);

export const googleLoginThunk = createAsyncThunk(
  'auth/googleLogin',
  async (payload: { email?: string; name?: string } = {}, { rejectWithValue }) => {
    try {
      const { data } = await authApi.googleLogin({
        ...payload,
        idToken: 'mock_google_id_token',
      });
      persistSession(data.user, data.tokens);
      return data;
    } catch {
      return rejectWithValue('Google sign-in failed');
    }
  },
);

export const updateProfileThunk = createAsyncThunk(
  'auth/updateProfile',
  async (updates: Partial<User>, { rejectWithValue, getState }) => {
    try {
      const { data } = await authApi.updateProfile(updates);
      const state = getState() as RootState;
      if (state.auth.tokens) persistSession(data, state.auth.tokens);
      return data;
    } catch {
      return rejectWithValue('Profile update failed');
    }
  },
);

export const refreshTokenThunk = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) return rejectWithValue('No refresh token');
      const { data } = await authApi.refresh(refreshToken);
      tokenStorage.set(data.tokens);
      return data.tokens;
    } catch {
      return rejectWithValue('Refresh failed');
    }
  },
);

export const validateSessionThunk = createAsyncThunk(
  'auth/validateSession',
  async (_, { rejectWithValue }) => {
    const tokens = tokenStorage.get();
    if (!tokens?.accessToken) return rejectWithValue('No session');

    if (isJwtExpired(tokens.accessToken)) {
      try {
        const { data } = await authApi.refresh(tokens.refreshToken);
        tokenStorage.set(data.tokens);
        const { data: user } = await authApi.me();
        storage.set(AUTH_STORAGE_KEY, user);
        return { user, tokens: data.tokens };
      } catch {
        storage.remove(AUTH_STORAGE_KEY);
        tokenStorage.clear();
        return rejectWithValue('Session expired');
      }
    }

    try {
      const { data: user } = await authApi.me();
      storage.set(AUTH_STORAGE_KEY, user);
      return { user, tokens };
    } catch {
      return rejectWithValue('Invalid session');
    }
  },
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try {
    await authApi.logout();
  } finally {
    storage.remove(AUTH_STORAGE_KEY);
    tokenStorage.clear();
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateAuth(state) {
      state.user = storage.get<User>(AUTH_STORAGE_KEY);
      state.tokens = storage.get<AuthTokens>(TOKEN_STORAGE_KEY);
    },
    clearAuthError(state) {
      state.error = null;
    },
    setTokens(state, action: PayloadAction<AuthTokens>) {
      state.tokens = action.payload;
      tokenStorage.set(action.payload);
    },
  },
  extraReducers: (builder) => {
    const pending = (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    };
    const authFulfilled = (
      state: AuthState,
      action: { payload: { user: User; tokens: AuthTokens } },
    ) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.sessionChecked = true;
    };

    builder
      .addCase(loginThunk.pending, pending)
      .addCase(loginThunk.fulfilled, authFulfilled)
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Login failed';
      })
      .addCase(signupThunk.pending, pending)
      .addCase(signupThunk.fulfilled, authFulfilled)
      .addCase(signupThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Signup failed';
      })
      .addCase(googleLoginThunk.pending, pending)
      .addCase(googleLoginThunk.fulfilled, authFulfilled)
      .addCase(googleLoginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Google login failed';
      })
      .addCase(updateProfileThunk.pending, pending)
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Update failed';
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.tokens = action.payload;
      })
      .addCase(validateSessionThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.sessionChecked = true;
      })
      .addCase(validateSessionThunk.rejected, (state) => {
        state.user = null;
        state.tokens = null;
        state.sessionChecked = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.tokens = null;
        state.isLoading = false;
        state.error = null;
        state.sessionChecked = true;
      });
  },
});

export const { hydrateAuth, clearAuthError, setTokens } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.user);
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthRole = (state: RootState) => state.auth.user?.role;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
