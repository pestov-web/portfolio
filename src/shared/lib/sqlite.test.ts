import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/lib/prisma', async () => {
  const { PrismaClient } = await import('../../../generated/prisma/client');
  const { PrismaBetterSqlite3 } = await import('@prisma/adapter-better-sqlite3');
  return { prisma: new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: ':memory:' }) }) };
});

import { prisma } from './prisma';
import { createDatabaseRateLimiter } from './rate-limit';

beforeAll(async () => {
  const migration = readFileSync('prisma/migrations-sqlite/20260909000000_init/migration.sql', 'utf8');
  for (const statement of migration.split(';').filter((sql) => sql.trim())) {
    await prisma.$executeRawUnsafe(statement);
  }
});

afterAll(async () => { await prisma.$disconnect(); });

describe('SQLite integration', () => {
  it('persists roles, dates and sessions with cascading deletion', async () => {
    const expiresAt = new Date('2030-01-01T00:00:00Z');
    await prisma.user.create({ data: {
      id: 'test-admin', email: 'sqlite@example.com', name: 'SQLite', role: 'ADMIN',
      sessions: { create: { id: 'test-session', token: 'test-token', expiresAt } },
    } });
    const session = await prisma.session.findUniqueOrThrow({ where: { token: 'test-token' }, include: { user: true } });
    expect(session.user.role).toBe('ADMIN');
    expect(session.expiresAt).toEqual(expiresAt);
    await prisma.user.delete({ where: { id: 'test-admin' } });
    expect(await prisma.session.count()).toBe(0);
  });

  it('enforces a shared atomic limit and resets an expired window', async () => {
    const limit = createDatabaseRateLimiter('integration', { windowMs: 60_000, max: 3 });
    const results = await Promise.all(Array.from({ length: 10 }, () => limit('same-key')));
    expect(results.filter((result) => result.success)).toHaveLength(3);
    const persisted = await prisma.appRateLimit.findUniqueOrThrow({ where: { scope_key: { scope: 'integration', key: 'same-key' } } });
    expect(persisted.count).toBe(4);
    const secondInstance = createDatabaseRateLimiter('integration', { windowMs: 60_000, max: 3 });
    expect((await secondInstance('same-key')).success).toBe(false);
    expect((await secondInstance('other-key')).success).toBe(true);
    await prisma.appRateLimit.update({ where: { scope_key: { scope: 'integration', key: 'same-key' } }, data: { resetAt: BigInt(0) } });
    expect(await limit('same-key')).toMatchObject({ success: true, remaining: 2 });
  });
});
