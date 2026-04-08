// src/validations/user.validation.ts
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    gmail: z.string().email("Định dạng email không đúng"),
    password: z.string().min(6, "Mật khẩu phải từ 6 ký tự trở lên"),
    role: z.enum(['admin', 'user']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    gmail: z.string().email("Email không hợp lệ"),
    password: z.string().min(1, "Mật khẩu không được để trống"),
  }),
});