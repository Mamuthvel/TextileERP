export class AppError extends Error {
  statusCode: number;
  isOperational = true;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(msg = 'Not found') {
    super(msg, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(msg = 'Unauthorized') {
    super(msg, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(msg = 'Forbidden: insufficient permissions') {
    super(msg, 403);
  }
}

export class ValidationError extends AppError {
  constructor(msg: string) {
    super(msg, 400);
  }
}

export class ConflictError extends AppError {
  constructor(msg: string) {
    super(msg, 409);
  }
}
