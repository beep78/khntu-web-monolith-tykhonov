import { z } from 'zod';

// userId береться з JWT, а не з тіла запиту
export const CreateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        courseId: z.number().int().positive(),
        quantity: z.number().int().positive().default(1),
      }),
    )
    .min(1, 'Замовлення має містити хоча б один курс')
    .refine((items) => new Set(items.map((i) => i.courseId)).size === items.length, {
      message: 'Один курс не можна додавати двічі',
    }),
});
export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'CANCELLED']),
});
export type UpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusSchema>;
