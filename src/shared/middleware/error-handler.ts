import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError | any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.error(`${err.statusCode} - ${err.message}`, err);
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  if (err.name === 'ValidationError') {
    logger.error(`Validation Error: ${err.message}`, err);
    res.status(400).json({
      error: err.message,
    });
    return;
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    logger.error(`Unique Constraint Error: ${err.message}`, err);
    res.status(400).json({
      error: 'Constraint violation',
    });
    return;
  }

  if (err.name === 'SequelizeDatabaseError') {
    logger.error(`Database Error: ${err.message}`, err);
    res.status(500).json({
      error: 'Database error occurred',
    });
    return;
  }

  logger.error(`500 - Internal Server Error: ${err.message}`, err);
  res.status(500).json({
    error: 'Internal Server Error',
  });
};

export const notFoundHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    error: 'Not Found',
  });
};
