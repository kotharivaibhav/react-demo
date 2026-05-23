/**
 * Mock Redis cache (in-memory) — simulates server-side caching layer.
 * In production, replace with ioredis / @redis/client against a real Redis instance.
 */

type CacheEntry = {
  value: string;
  expiresAt: number;
};

class MockRedisCache {
  private store = new Map<string, CacheEntry>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    try {
      return JSON.parse(entry.value) as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds = 60): Promise<void> {
    this.store.set(key, {
      value: JSON.stringify(value),
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  /** Invalidate all keys starting with prefix (e.g. "products:") */
  async invalidatePrefix(prefix: string): Promise<number> {
    let count = 0;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
        count += 1;
      }
    }
    return count;
  }

  stats(): { size: number; keys: string[] } {
    return { size: this.store.size, keys: [...this.store.keys()] };
  }
}

export const redisCache = new MockRedisCache();

export const cacheKeys = {
  productsList: (params: Record<string, unknown>) => `products:list:${JSON.stringify(params)}`,
  productById: (id: string) => `products:item:${id}`,
};
