import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[MIL-ERROR-LOG]:', err);

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Error interno en el subsistema de mando y control',
      code: err.code || 'TACTICAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
    },
  });
};
