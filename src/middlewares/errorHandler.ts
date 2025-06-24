import { Request, Response, NextFunction } from 'express';

// export interface AppError extends Error {
//   status?: number;
// }

// export const errorHandler = (
//   err: AppError,
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   console.error(err);
//   res.status(err.status || 500).json({
//     message: err.message || "Internal Server Error",
//   });
// };

interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error('ERROR:', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      });
    }
  }
};

export default errorHandler;
