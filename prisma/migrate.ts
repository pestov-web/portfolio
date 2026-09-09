import { config } from 'dotenv';
import { spawnSync } from 'node:child_process';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';

config({ path: '.env.local' });

async function main() {
  const url = process.env.DATABASE_URL ?? 'file:./portfolio.db';
  if (!url.startsWith('file:')) throw new Error('DATABASE_URL must point to a SQLite file');
  process.env.DATABASE_URL = url;
  // Initialize a fresh file before Prisma's schema engine opens it, and persist WAL mode.
  const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
  try {
    await db.$queryRawUnsafe('PRAGMA journal_mode = WAL');
  } finally {
    await db.$disconnect();
  }
  const result = spawnSync('pnpm', ['exec', 'prisma', 'migrate', 'deploy'], { stdio: 'inherit', env: process.env });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
