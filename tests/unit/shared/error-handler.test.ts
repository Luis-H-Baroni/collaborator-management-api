import { Request, Response, NextFunction } from 'express';
import {
  AppError,
  errorHandler,
  notFoundHandler,
} from '../../../src/shared/middleware/error-handler';
import logger from '../../../src/shared/utils/logger';

jest.mock('../../../src/shared/utils/logger');

describe('error-handler middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('AppError', () => {
    it('should create error with default status code', () => {
      const error = new AppError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
    });

    it('should create error with custom status code', () => {
      const error = new AppError('Not found', 404);
      expect(error.message).toBe('Not found');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('errorHandler', () => {
    it('should handle AppError correctly', () => {
      const error = new AppError('Custom error', 400);

      errorHandler(error, req as Request, res as Response, next);

      expect(logger.error).toHaveBeenCalledWith('400 - Custom error', error);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Custom error' });
    });

    it('should handle ValidationError', () => {
      const error = new Error('Validation failed');
      (error as any).name = 'ValidationError';

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Validation failed' });
    });

    it('should handle SequelizeUniqueConstraintError', () => {
      const error = new Error('Unique constraint violation');
      (error as any).name = 'SequelizeUniqueConstraintError';

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'A record with this email already exists',
      });
    });

    it('should handle SequelizeDatabaseError', () => {
      const error = new Error('Database error');
      (error as any).name = 'SequelizeDatabaseError';

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error occurred',
      });
    });

    it('should handle generic errors as 500', () => {
      const error = new Error('Internal server error');

      errorHandler(error, req as Request, res as Response, next);

      expect(logger.error).toHaveBeenCalledWith(
        '500 - Internal Server Error: Internal server error',
        error
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('notFoundHandler', () => {
    it('should return 404 for not found routes', () => {
      notFoundHandler(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not Found' });
    });
  });
});
