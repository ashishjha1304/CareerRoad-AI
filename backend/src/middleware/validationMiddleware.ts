import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { errorResponse } from '../utils/apiResponse';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Zod v4 uses `.issues` instead of `.errors`
        return errorResponse(res, 'Validation failed', 400, error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })));
      }
      return errorResponse(res, 'Internal validation error', 500);
    }
  };
};
