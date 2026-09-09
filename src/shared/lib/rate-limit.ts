import { prisma } from "@/shared/lib/prisma";

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

export function createDatabaseRateLimiter(scope: string, options: RateLimitOptions) {
  const memoryFallback = createMemoryRateLimiter(options);

  return async (key: string): Promise<RateLimitResult> => {
    try {
      const now = Date.now();
      const rows = await prisma.$queryRawUnsafe<Array<{ count: number | bigint; reset_at: number | bigint }>>(
        `
          INSERT INTO app_rate_limits (scope, key, count, reset_at)
          VALUES (?, ?, 1, ?)
          ON CONFLICT (scope, key)
          DO UPDATE SET
            count = CASE
              WHEN app_rate_limits.reset_at <= ? THEN 1
              ELSE MIN(app_rate_limits.count + 1, ?)
            END,
            reset_at = CASE
              WHEN app_rate_limits.reset_at <= ? THEN excluded.reset_at
              ELSE app_rate_limits.reset_at
            END
          RETURNING
            count,
            reset_at
        `,
        scope,
        key,
        now + options.windowMs,
        now,
        options.max + 1,
        now
      );

      const row = rows[0];
      const count = Number(row.count);
      const success = count <= options.max;

      return {
        success,
        remaining: success ? Math.max(0, options.max - count) : 0,
        retryAfter: Math.max(1, Math.ceil((Number(row.reset_at) - now) / 1000)),
      };
    } catch {
      return memoryFallback(key);
    }
  };
}

export const contactRateLimiter = createDatabaseRateLimiter("contact", {
  windowMs: 60_000,
  max: 5,
});
