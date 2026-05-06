"use client";

import { useEffect, useState } from "react";

const memoryCache = new Map<string, unknown>();
const cacheTtlMs = 5 * 60 * 1000;

export function useApiData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const cachedPayload = getCachedPayload<T>(url);

    if (cachedPayload) {
      queueMicrotask(() => {
        if (isMounted) {
          setData(cachedPayload);
          setIsLoading(false);
        }
      });
    }

    async function load() {
      setIsLoading(!cachedPayload);
      setError(null);

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Request failed: ${url}`);
        }

        const payload = (await response.json()) as T;

        setCachedPayload(url, payload);

        if (isMounted) {
          setData(payload);
        }
      } catch {
        if (isMounted) {
          setError("Dashboard data could not be loaded.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, isLoading, error };
}

function getCachedPayload<T>(url: string): T | null {
  const memoryPayload = memoryCache.get(url) as T | undefined;

  if (memoryPayload) {
    return memoryPayload;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(cacheKey(url));

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as { expiresAt: number; payload: T };

    if (parsed.expiresAt < Date.now()) {
      window.sessionStorage.removeItem(cacheKey(url));
      return null;
    }

    memoryCache.set(url, parsed.payload);
    return parsed.payload;
  } catch {
    return null;
  }
}

function setCachedPayload<T>(url: string, payload: T) {
  memoryCache.set(url, payload);

  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(
      cacheKey(url),
      JSON.stringify({ expiresAt: Date.now() + cacheTtlMs, payload }),
    );
  } catch {
    // Storage may be unavailable in private browsing or constrained contexts.
  }
}

function cacheKey(url: string) {
  return `retail-dashboard:${url}`;
}
