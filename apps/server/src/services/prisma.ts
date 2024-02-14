import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient({
    log: ['info', 'error']
});

export default prismaClient;
