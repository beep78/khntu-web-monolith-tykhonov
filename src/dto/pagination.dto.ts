import { z } from 'zod';

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1, 'page має бути не менше 1').default(1),
  limit: z.coerce.number().int().min(1, 'limit має бути не менше 1').max(50, 'limit не більше 50').default(10),
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
