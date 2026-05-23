import type { JwtPayload, UserRole } from '@/types';

const encode = (obj: object): string =>
  btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const decode = (segment: string): JwtPayload => {
  const padded = segment.replace(/-/g, '+').replace(/_/g, '/');
  const json = atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), '='));
  return JSON.parse(json) as JwtPayload;
};

/** Creates a mock JWT (header.payload.signature) for demo purposes. */
export const createJwt = (
  payload: Omit<JwtPayload, 'iat' | 'exp'> & { expiresInMs?: number },
): string => {
  const iat = Math.floor(Date.now() / 1000);
  const exp = Math.floor((Date.now() + (payload.expiresInMs ?? 3600_000)) / 1000);
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const body = encode({
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
    iat,
    exp,
  });
  return `${header}.${body}.mock_signature`;
};

export const parseJwt = (token: string): JwtPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    return decode(parts[1]);
  } catch {
    return null;
  }
};

export const isJwtExpired = (token: string): boolean => {
  const payload = parseJwt(token);
  if (!payload) return true;
  return payload.exp * 1000 < Date.now();
};

export const getRoleFromToken = (token: string): UserRole | null => {
  return parseJwt(token)?.role ?? null;
};
