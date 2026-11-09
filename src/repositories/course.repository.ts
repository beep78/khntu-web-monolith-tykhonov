import { prisma } from '../lib/prisma';
import { CreateCourseDto } from '../dto/course.dto';

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

  create(data: CreateCourseDto) {
    return prisma.course.create({ data });
  }
}
