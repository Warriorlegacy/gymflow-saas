import { useCallback, useEffect, useState, useRef } from "react";

interface UseAsyncResourceResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Simple in-memory cache for mobile
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 15000; // 15 seconds
const MAX_CACHE_ENTRIES = 50;

export function useAsyncResource<T>(
  loader: () => Promise<T>,
  fallback: T,
  cacheKey?: string,
): UseAsyncResourceResult<T> {
  const [data, setData] = useState<T>(() => {
    if (cacheKey) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data as T;
      }
    }
    return fallback;
  });
  const [loading, setLoading] = useState(!cacheKey || !cache.has(cacheKey));
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const mountedRef = useRef(true);

  const refetch = useCallback(() => {
    if (cacheKey) {
      cache.delete(cacheKey);
    }
    setRefreshKey((k) => k + 1);
  }, [cacheKey]);

  useEffect(() => {
    mountedRef.current = true;

    // Check cache first
    if (cacheKey) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setData(cached.data as T);
        setLoading(false);
        return;
      }
    }

    setLoading(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    loader()
      .then((result) => {
        if (mountedRef.current) {
          setData(result);
          setError(null);
          if (cacheKey) {
            // Clean up old entries if cache is too large
            if (cache.size >= MAX_CACHE_ENTRIES) {
              const keysToDelete: string[] = [];
              for (const [k, v] of cache.entries()) {
                if (Date.now() - v.timestamp > CACHE_TTL) {
                  keysToDelete.push(k);
                }
              }
              for (const k of keysToDelete) {
                cache.delete(k);
              }
            }
            cache.set(cacheKey, { data: result, timestamp: Date.now() });
          }
        }
      })
      .catch((err) => {
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : "Failed to load data");
        }
      })
      .finally(() => {
        clearTimeout(timeout);
        if (mountedRef.current) {
          setLoading(false);
        }
      });

    return () => {
      mountedRef.current = false;
      controller.abort();
      clearTimeout(timeout);
    };
  }, [loader, refreshKey, cacheKey]);

  return { data, loading, error, refetch };
}

export function clearCache(): void {
  cache.clear();
}

export function clearCacheEntry(key: string): void {
  cache.delete(key);
}
