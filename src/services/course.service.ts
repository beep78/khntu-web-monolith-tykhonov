import { AppError } from '../utils/AppError';
import { CourseRepository } from '../repositories/course.repository';
import { UserRepository } from '../repositories/user.repository';
import { CreateCourseDto } from '../dto/course.dto';

const courseRepository = new CourseRepository();
const userRepository = new UserRepository();

export class CourseService {
  async getPage(page: number, limit: number) {
    const result = await courseRepository.findPaginated(page, limit);
    return { ...result, hasNextPage: page < result.totalPages };
  }

  async getById(id: number) {
    const course = await courseRepository.findById(id);
    if (!course) throw new AppError('Курс не знайдено', 404);
    return course;
  }

  async create(dto: CreateCourseDto) {
    const instructor = await userRepository.findById(dto.instructorId);
    if (!instructor) throw new AppError('Викладача з таким id не знайдено', 404);
    if (instructor.role === 'USER') throw new AppError('Курс може вести лише MANAGER або ADMIN', 400);
    return courseRepository.create(dto);
  }
}
