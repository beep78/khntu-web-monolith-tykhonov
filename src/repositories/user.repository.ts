import { prisma } from '../lib/prisma';

export class UserRepository {
  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  create(data: { email: string; password: string; fullName: string; role?: string }) {
    return prisma.user.create({ data });
  }
}
