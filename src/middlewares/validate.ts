import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validate = (schema: z.ZodSchema) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: unknown) { // Khai báo error là unknown
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Dữ liệu không hợp lệ',
          // Sử dụng error.issues thay vì error.errors
          details: error.issues.map(e => ({
            path: e.path[1] || e.path[0], 
            message: e.message
          }))
        });
      }
      return res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
  };