type RateLimitOptions = {
  windowMs: number;
  max: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  success: boolean;
  remaining: number;
  retryAfter: number;
};

export function createMemoryRateLimiter(options: RateLimitOptions) {
  const store = new Map<string, RateLimitEntry>();

  return (key: string, now = Date.now()): RateLimitResult => {
    const current = store.get(key);

    if (!current || current.resetAt <= now) {
      store.set(key, {
        count: 1,
        resetAt: now + options.windowMs,
      });

      return {
        success: true,
        remaining: options.max - 1,
        retryAfter: Math.ceil(options.windowMs / 1000),
      };
    }

    if (current.count >= options.max) {
      return {
        success: false,
        remaining: 0,
        retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
      };
    }

    current.count += 1;
    store.set(key, current);

    return {
      success: true,
      remaining: options.max - current.count,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  };
}

export const contactRateLimiter = createMemoryRateLimiter({
  windowMs: 60_000,
  max: 5,
});