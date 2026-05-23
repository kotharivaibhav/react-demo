import type { SignupPayload, User, UserRole } from '@/types';

type StoredUser = User & { password: string };

const users: StoredUser[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
  },
  {
    id: 'vendor-1',
    name: 'Vendor User',
    email: 'vendor@test.com',
    password: 'vendor123',
    role: 'vendor',
    avatar: 'https://i.pravatar.cc/150?u=vendor',
  },
  {
    id: 'user-1',
    name: 'Demo User',
    email: 'demo@test.com',
    password: 'demo123',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?u=demo',
  },
];

export const toPublicUser = (stored: StoredUser): User => {
  const { password: _pw, ...user } = stored;
  void _pw;
  return user;
};

export const mockUserStore = {
  findByEmail: (email: string): StoredUser | undefined =>
    users.find((u) => u.email.toLowerCase() === email.toLowerCase()),

  findById: (id: string): StoredUser | undefined => users.find((u) => u.id === id),

  create: (payload: SignupPayload): User => {
    const existing = mockUserStore.findByEmail(payload.email);
    if (existing) throw new Error('Email already registered');

    const user: StoredUser = {
      id: `user-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role ?? 'user',
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(payload.email)}`,
    };
    users.push(user);
    return toPublicUser(user);
  },

  update: (id: string, updates: Partial<User>): User | null => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates };
    return toPublicUser(users[index]);
  },

  verifyPassword: (email: string, password: string): User | null => {
    const user = mockUserStore.findByEmail(email);
    if (!user || user.password !== password) return null;
    return toPublicUser(user);
  },

  roleFromEmail: (email: string): UserRole => {
    if (email.includes('admin')) return 'admin';
    if (email.includes('vendor')) return 'vendor';
    return 'user';
  },
};
