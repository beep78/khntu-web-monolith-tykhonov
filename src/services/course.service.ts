import { AppError } from '../utils/AppError'

export class CourseService {
  private courses = [
    { id: 1, categoryId: 1, title: 'Основи TypeScript', price: 1200 },
    { id: 2, categoryId: 1, title: 'Node.js та Express', price: 1800 },
    { id: 3, categoryId: 2, title: 'UX-проєктування у Figma', price: 1500 },
  ]

  getAll() {
    return this.courses
  }

  getById(id: number) {
    const course = this.courses.find((c) => c.id === id)
    if (!course) throw new AppError('Курс не знайдено', 404)
    return course
  }
}
