import { Request, Response, NextFunction } from 'express';
import { createLogger, transports, format } from 'winston';

const auditLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console({
      silent: process.env.NODE_ENV === 'test',
    }),
  ],
});

const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const auditLog = (req: Request, res: Response, next: NextFunction): void => {
  if (!MUTATION_METHODS.has(req.method)) {
    next();
    return;
  }

  const originalJson = res.json.bind(res);

  res.json = function (body: unknown) {
    const userId = (req as any).user?._id?.toString() || 'anonymous';
    const userEmail = (req as any).user?.email || 'anonymous';

    auditLogger.info({
      type: 'audit',
      method: req.method,
      path: req.path,
      userId,
      userEmail,
      statusCode: res.statusCode,
      success: (body as any)?.success ?? true,
    });

    return originalJson(body);
  };

  next();
};
