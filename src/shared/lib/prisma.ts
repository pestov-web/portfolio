import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// Singleton паттерн для Prisma клиента в Next.js dev-режиме
// В dev hot reload создаёт несколько инстансов без этого паттерна
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    prismaClientClass: typeof PrismaClient | undefined;
};

function createPrismaClient() {
    const adapter = new PrismaBetterSqlite3({
        url: process.env.DATABASE_URL ?? 'file:./portfolio.db',
    });

    return new PrismaClient({ adapter });
}

function getPrismaClient(): PrismaClient {
    const cachedPrisma = globalForPrisma.prisma;
    const canReuseCachedClient = cachedPrisma && globalForPrisma.prismaClientClass === PrismaClient;

    if (canReuseCachedClient) {
        return cachedPrisma;
    }

    if (cachedPrisma) {
        void cachedPrisma.$disconnect();
    }

    return createPrismaClient();
}

export const prisma = getPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
    globalForPrisma.prismaClientClass = PrismaClient;
}
