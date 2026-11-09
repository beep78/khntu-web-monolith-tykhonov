import { z } from 'zod';

export const CreateCourseSchema = z.object({
  title: z.string().min(3, 'Назва курсу має містити не менше 3 символів'),
  description: z.string().max(500, 'Опис не довший за 500 символів').optional(),
  price: z.number().positive('Ціна має бути більшою за 0'),
  // якщо не вказано, викладачем стає автор запиту
  instructorId: z.number().int().positive('instructorId має бути додатним цілим числом').optional(),
});
export type CreateCourseDto = z.infer<typeof CreateCourseSchema>;
