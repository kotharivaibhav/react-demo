import { cacheKeys, redisCache } from '@/api/cache/redisCache';
import { mockProducts } from '@/api/mockProducts';
import { filterAndSortProducts, paginateProducts } from '@/api/mock/productFilters';
import { mockStockStore } from '@/api/mock/mockStockStore';
import { mockUserStore, toPublicUser } from '@/api/mock/mockUserStore';
import { EXPIRED_ACCESS_TOKEN } from '@/api/tokenStorage';
import { API_ENDPOINTS } from '@/api/endpoints';
import { createJwt } from '@/utils/jwt';
import type { AuthTokens, LoginResponse, Product, ProductCategory, User } from '@/types';
import type { InternalAxiosRequestConfig } from 'axios';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomLatency = () => delay(200 + Math.floor(Math.random() * 300));

let stockHydrated = false;
const ensureStockStore = () => {
  if (!stockHydrated) {
    mockStockStore.init(mockProducts);
    stockHydrated = true;
  }
};

const enrichProduct = (product: Product): Product => {
  ensureStockStore();
  return { ...product, stock: mockStockStore.get(product.id) };
};

const enrichPaginated = <T extends { items: Product[] }>(data: T): T => ({
  ...data,
  items: data.items.map(enrichProduct),
});

const createTokens = (user: User): AuthTokens => ({
  accessToken: createJwt({
    sub: user.id,
    email: user.email,
    role: user.role,
    expiresInMs: 3600_000,
  }),
  refreshToken: createJwt({
    sub: user.id,
    email: user.email,
    role: user.role,
    expiresInMs: 7 * 24 * 3600_000,
  }),
});

const authResponse = (user: User): LoginResponse => ({
  user,
  tokens: createTokens(user),
});

const getAuthHeader = (config: InternalAxiosRequestConfig): string | null => {
  const header = config.headers?.Authorization;
  if (typeof header === 'string') return header.replace('Bearer ', '');
  return null;
};

const getUserFromToken = (token: string | null): User | null => {
  if (!token || token === EXPIRED_ACCESS_TOKEN) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) as {
      sub: string;
    };
    const stored = mockUserStore.findById(payload.sub);
    if (!stored) return null;
    return toPublicUser(stored);
  } catch {
    return null;
  }
};

export const handleMockRequest = async (
  config: InternalAxiosRequestConfig,
): Promise<{ data: unknown; status: number }> => {
  await randomLatency();

  const method = (config.method ?? 'get').toLowerCase();
  const url = config.url ?? '';
  const params = config.params as Record<string, string | number> | undefined;

  // --- Auth ---
  if (method === 'post' && url === API_ENDPOINTS.AUTH.LOGIN) {
    const body = config.data as { email: string; password: string };
    const user = mockUserStore.verifyPassword(body.email, body.password);
    if (!user) return { data: { message: 'Invalid email or password' }, status: 401 };
    return { data: authResponse(user), status: 200 };
  }

  if (method === 'post' && url === API_ENDPOINTS.AUTH.SIGNUP) {
    try {
      const body = config.data as {
        name: string;
        email: string;
        password: string;
      };
      const user = mockUserStore.create({
        name: body.name,
        email: body.email,
        password: body.password,
        role: 'user',
      });
      return { data: authResponse(user), status: 201 };
    } catch (e) {
      return { data: { message: (e as Error).message }, status: 409 };
    }
  }

  if (method === 'post' && url === API_ENDPOINTS.AUTH.GOOGLE) {
    const body = config.data as { idToken?: string; email?: string; name?: string };
    const email = body.email ?? 'google.user@gmail.com';
    const name = body.name ?? 'Google User';
    const user = mockUserStore.findByEmail(email);
    if (!user) {
      const created = mockUserStore.create({
        name,
        email,
        password: `oauth_${Date.now()}`,
        role: 'user',
      });
      return { data: authResponse(created), status: 200 };
    }
    return { data: authResponse(toPublicUser(user)), status: 200 };
  }

  if (method === 'post' && url === API_ENDPOINTS.AUTH.REFRESH) {
    const body = config.data as { refreshToken: string };
    try {
      const payload = JSON.parse(
        atob(body.refreshToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')),
      ) as { sub: string };
      const stored = mockUserStore.findById(payload.sub);
      if (!stored) return { data: { message: 'Invalid refresh token' }, status: 401 };
      return { data: { tokens: createTokens(toPublicUser(stored)) }, status: 200 };
    } catch {
      return { data: { message: 'Invalid refresh token' }, status: 401 };
    }
  }

  if (method === 'post' && url === API_ENDPOINTS.AUTH.LOGOUT) {
    return { data: { success: true }, status: 200 };
  }

  if (method === 'get' && url === API_ENDPOINTS.AUTH.ME) {
    const user = getUserFromToken(getAuthHeader(config));
    if (!user) return { data: { message: 'Unauthorized' }, status: 401 };
    return { data: user, status: 200 };
  }

  if (method === 'patch' && url === API_ENDPOINTS.AUTH.PROFILE) {
    const user = getUserFromToken(getAuthHeader(config));
    if (!user) return { data: { message: 'Unauthorized' }, status: 401 };
    const updates = config.data as Partial<User>;
    const updated = mockUserStore.update(user.id, updates);
    if (!updated) return { data: { message: 'Not found' }, status: 404 };
    return { data: updated, status: 200 };
  }

  if (url.startsWith('/products')) {
    const token = getAuthHeader(config);
    if (token === EXPIRED_ACCESS_TOKEN) {
      return { data: { message: 'Token expired' }, status: 401 };
    }
  }

  if (method === 'get' && url === API_ENDPOINTS.PRODUCTS.LIST) {
    const queryParams = {
      page: Number(params?.page ?? 1),
      limit: Number(params?.limit ?? 6),
      search: String(params?.search ?? ''),
      category: String(params?.category ?? 'all'),
      sortBy: String(params?.sortBy ?? 'name'),
      sortOrder: String(params?.sortOrder ?? 'asc'),
    };
    const cacheKey = cacheKeys.productsList(queryParams);
    const cached = await redisCache.get<ReturnType<typeof paginateProducts>>(cacheKey);
    if (cached) {
      return { data: enrichPaginated(cached), status: 200 };
    }

    const filtered = filterAndSortProducts(
      queryParams.search,
      queryParams.category as ProductCategory,
      queryParams.sortBy as 'name' | 'price',
      queryParams.sortOrder as 'asc' | 'desc',
    );
    const paginated = paginateProducts(filtered, queryParams.page, queryParams.limit);
    await redisCache.set(cacheKey, paginated, 120);
    return { data: enrichPaginated(paginated), status: 200 };
  }

  if (method === 'get' && url === API_ENDPOINTS.PRODUCTS.ALL) {
    const cacheKey = 'products:all';
    const cached = await redisCache.get<Product[]>(cacheKey);
    if (cached) return { data: cached.map(enrichProduct), status: 200 };
    const all = mockProducts.map(enrichProduct);
    await redisCache.set(cacheKey, all, 60);
    return { data: all, status: 200 };
  }

  const productIdMatch = url.match(/^\/products\/([^/]+)$/);
  if (method === 'get' && productIdMatch) {
    const id = productIdMatch[1];
    const cacheKey = cacheKeys.productById(id);
    const cached = await redisCache.get<Product>(cacheKey);
    if (cached) return { data: enrichProduct(cached), status: 200 };

    const product = mockProducts.find((p) => p.id === id);
    if (!product) return { data: { message: 'Not found' }, status: 404 };
    const enriched = enrichProduct(product);
    await redisCache.set(cacheKey, enriched, 120);
    return { data: enriched, status: 200 };
  }

  if (method === 'post' && url === API_ENDPOINTS.ORDERS.CHECKOUT) {
    const user = getUserFromToken(getAuthHeader(config));
    if (!user) return { data: { message: 'Unauthorized' }, status: 401 };
    await redisCache.invalidatePrefix('products:');
    return {
      data: {
        orderId: `ORD-${Date.now()}`,
        status: 'confirmed',
        message: 'Order placed successfully (mock)',
      },
      status: 201,
    };
  }

  return {
    data: { message: `Mock handler not found: ${method.toUpperCase()} ${url}` },
    status: 404,
  };
};
