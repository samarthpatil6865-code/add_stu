import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class ApiResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Operation successful',
    statusCode: number = 200,
    pagination?: any
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };

    if (pagination) {
      response.pagination = pagination;
    }

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string = 'Internal server error',
    statusCode: number = 500,
    error?: string,
    errors?: any[]
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
    };

    if (error) {
      response.error = error;
    }

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): Response {
    return this.success(res, data, message, 201);
  }

  static updated<T>(
    res: Response,
    data: T,
    message: string = 'Resource updated successfully'
  ): Response {
    return this.success(res, data, message);
  }

  static deleted(
    res: Response,
    message: string = 'Resource deleted successfully'
  ): Response {
    return this.success(res, null, message);
  }

  static notFound(
    res: Response,
    message: string = 'Resource not found'
  ): Response {
    return this.error(res, message, 404);
  }

  static badRequest(
    res: Response,
    message: string = 'Bad request',
    errors?: any[]
  ): Response {
    return this.error(res, message, 400, undefined, errors);
  }

  static unauthorized(
    res: Response,
    message: string = 'Unauthorized'
  ): Response {
    return this.error(res, message, 401);
  }

  static forbidden(
    res: Response,
    message: string = 'Forbidden'
  ): Response {
    return this.error(res, message, 403);
  }

  static conflict(
    res: Response,
    message: string = 'Conflict'
  ): Response {
    return this.error(res, message, 409);
  }
}

export const asyncHandler = (fn: Function) => {
  return (req: any, res: Response, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
