// Simple in-memory cache for API responses
// In production, consider using Redis or similar

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  set<T>(key: string, data: T, ttlMs: number = 5000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

// Singleton cache instance
export const apiCache = new SimpleCache();

// Cache key generators
export const cacheKeys = {
  dashboard: (gymId: string) => `dashboard:${gymId}`,
  members: (gymId: string, page: number = 1) => `members:${gymId}:${page}`,
  memberDashboard: (memberId: string, gymId: string) =>
    `member-dashboard:${memberId}:${gymId}`,
  plans: (gymId: string) => `plans:${gymId}`,
  payments: (gymId: string, page: number = 1) => `payments:${gymId}:${page}`,
  attendance: (gymId: string, page: number = 1) =>
    `attendance:${gymId}:${page}`,
  trainers: (gymId: string) => `trainers:${gymId}`,
  workouts: (gymId: string) => `workouts:${gymId}`,
  dietPlans: (gymId: string) => `diet-plans:${gymId}`,
};

// Cache TTLs
export const cacheTTL = {
  dashboard: 5000, // 5 seconds
  members: 10000, // 10 seconds
  memberDashboard: 10000, // 10 seconds
  plans: 30000, // 30 seconds (plans change rarely)
  payments: 10000, // 10 seconds
  attendance: 5000, // 5 seconds (attendance changes frequently)
  trainers: 30000, // 30 seconds
  workouts: 30000, // 30 seconds
  dietPlans: 30000, // 30 seconds
};

// Cache invalidation helpers
export function invalidateGymCache(gymId: string): void {
  // Invalidate all cache entries for a gym
  for (const key of apiCache["cache"].keys()) {
    if (key.includes(gymId)) {
      apiCache.delete(key);
    }
  }
}

export function invalidateMemberCache(memberId: string): void {
  // Invalidate member-specific cache
  for (const key of apiCache["cache"].keys()) {
    if (key.includes(memberId)) {
      apiCache.delete(key);
    }
  }
}
