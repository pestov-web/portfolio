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

let rateLimitTableReady: Promise<void> | null = null;

async function ensureRateLimitTable() {
  if (!rateLimitTableReady) {
    rateLimitTableReady = (async () => {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS app_rate_limits (
          scope TEXT NOT NULL,
          key TEXT NOT NULL,
          count INTEGER NOT NULL,
          reset_at TIMESTAMPTZ NOT NULL,
          PRIMARY KEY (scope, key)
        )
      `);

      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS app_rate_limits_reset_at_idx
        ON app_rate_limits (reset_at)
      `);
    })();
  }

  await rateLimitTableReady;
}

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
      await ensureRateLimitTable();

      const rows = await prisma.$queryRawUnsafe<Array<{ count: number; retryAfter: number }>>(
        `
          INSERT INTO app_rate_limits (scope, key, count, reset_at)
          VALUES ($1, $2, 1, NOW() + ($3 || ' milliseconds')::interval)
          ON CONFLICT (scope, key)
          DO UPDATE SET
            count = CASE
              WHEN app_rate_limits.reset_at <= NOW() THEN 1
              ELSE LEAST(app_rate_limits.count + 1, $4 + 1)
            END,
            reset_at = CASE
              WHEN app_rate_limits.reset_at <= NOW() THEN NOW() + ($3 || ' milliseconds')::interval
              ELSE app_rate_limits.reset_at
            END
          RETURNING
            count,
            GREATEST(1, CEIL(EXTRACT(EPOCH FROM reset_at - NOW())))::int AS "retryAfter"
        `,
        scope,
        key,
        options.windowMs,
        options.max
      );

      const row = rows[0];
      const success = row.count <= options.max;

      return {
        success,
        remaining: success ? Math.max(0, options.max - row.count) : 0,
        retryAfter: row.retryAfter,
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