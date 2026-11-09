import { PrismaClient } from '@prisma/client';

// Єдиний екземпляр клієнта на весь застосунок
export const prisma = new PrismaClient();
