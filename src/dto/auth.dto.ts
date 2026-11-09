import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Некоректний email'),
  password: z.string().min(8, 'Пароль має містити не менше 8 символів'),
  fullName: z.string().min(2, 'Вкажіть повне імʼя'),
});
export type RegisterDto = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Некоректний email'),
  password: z.string().min(1, 'Вкажіть пароль'),
});
export type LoginDto = z.infer<typeof LoginSchema>;
