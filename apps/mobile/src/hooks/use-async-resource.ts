import { useEffect, useState } from "react";

interface UseAsyncResourceResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

export function useAsyncResource<T>(
  loader: () => Promise<T>,
  fallback: T,
): UseAsyncResourceResult<T> {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    loader()
      .then((result) => {
        if (mounted) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error("Failed to load resource:", err);
          setError(err instanceof Error ? err.message : "Failed to load data");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [loader]);

  return { data, loading, error };
}
