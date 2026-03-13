import { Response } from 'express';

export const successResponse = (res: Response, data: any = null, message: string = 'Success', status: number = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res: Response, message: string = 'An error occurred', status: number = 500, errors: any = null) => {
  return res.status(status).json({
    success: false,
    message,
    errors
  });
};
