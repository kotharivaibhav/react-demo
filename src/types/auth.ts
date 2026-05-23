export type UserRole = 'admin' | 'vendor' | 'user';

export type Permission =
  | 'products:read'
  | 'products:manage'
  | 'orders:read'
  | 'orders:manage'
  | 'users:read'
  | 'users:manage'
  | 'dashboard:admin'
  | 'dashboard:vendor'
  | 'cart:checkout';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: Address;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
  exp: number;
  iat: number;
};

export type LoginResponse = {
  user: User;
  tokens: AuthTokens;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};
