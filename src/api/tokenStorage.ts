import { TOKEN_STORAGE_KEY } from '@/constants';
import type { AuthTokens } from '@/types';
import { storage } from '@/utils';

export const tokenStorage = {
  get(): AuthTokens | null {
    return storage.get<AuthTokens>(TOKEN_STORAGE_KEY);
  },
  set(tokens: AuthTokens): void {
    storage.set(TOKEN_STORAGE_KEY, tokens);
  },
  clear(): void {
    storage.remove(TOKEN_STORAGE_KEY);
  },
  getAccessToken(): string | null {
    return this.get()?.accessToken ?? null;
  },
  getRefreshToken(): string | null {
    return this.get()?.refreshToken ?? null;
  },
};

/** Mock: tokens with this access value simulate expiry (triggers refresh flow). */
export const EXPIRED_ACCESS_TOKEN = 'expired_access_token';
