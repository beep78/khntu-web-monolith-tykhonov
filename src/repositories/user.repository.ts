import { prisma } from '../lib/prisma';

export class UserRepository {
  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }
}
