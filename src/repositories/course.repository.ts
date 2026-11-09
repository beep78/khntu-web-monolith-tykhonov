import { prisma } from '../lib/prisma';

export class CourseRepository {
  async findPaginated(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.course.findMany({ skip, take: limit, orderBy: { id: 'desc' } }),
      prisma.course.count(),
    ]);
    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  findById(id: number) {
    return prisma.course.findUnique({ where: { id } });
  }

  create(data: { title: string; description?: string; price: number; instructorId: number }) {
    return prisma.course.create({ data });
  }

  // видалення разом із залежними записами в одній транзакції
  async deleteById(id: number) {
    return prisma.$transaction(async (tx) => {
      const modules = await tx.module.findMany({ where: { courseId: id }, select: { id: true } });
      await tx.lesson.deleteMany({ where: { moduleId: { in: modules.map((m) => m.id) } } });
      await tx.module.deleteMany({ where: { courseId: id } });
      await tx.orderItem.deleteMany({ where: { courseId: id } });
      await tx.enrollment.deleteMany({ where: { courseId: id } });
      return tx.course.delete({ where: { id } });
    });
  }
}
