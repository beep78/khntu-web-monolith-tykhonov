import { AppError } from '../utils/AppError';

const categories = [
  { id: 1, name: 'Програмування' },
  { id: 2, name: 'Дизайн' },
  { id: 3, name: 'Маркетинг' },
];

export class CategoryService {
  getAll() {
    return categories;
  }

  getById(id: number) {
    const category = categories.find((c) => c.id === id);
    if (!category) {
      throw new AppError('Категорію не знайдено', 404);
    }
    return category;
  }
}
