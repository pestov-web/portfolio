import { randomUUID } from 'node:crypto';
import { prisma } from '../src/shared/lib/prisma';

async function main() {
  const [, , action, id, token] = process.argv;
  if (!id || !/^[a-f0-9-]{36}$/.test(id)) throw new Error('Invalid fixture id');
  if (action === 'create') {
    await prisma.user.create({ data: { id, name: 'E2E admin', email: `${id}@example.com`, role: 'ADMIN',
      sessions: { create: { id: randomUUID(), token, expiresAt: new Date(Date.now() + 120_000) } } } });
  } else if (action === 'delete') {
    await prisma.user.delete({ where: { id, email: `${id}@example.com` } });
  } else throw new Error('Invalid fixture action');
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
