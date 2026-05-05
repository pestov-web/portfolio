import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Singleton паттерн для Prisma клиента в Next.js dev-режиме
// В dev hot reload создаёт несколько инстансов без этого паттерна
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    prismaClientClass: typeof PrismaClient | undefined;
};

function createPrismaClient() {
    const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL!,
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
