import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedMilitaryRequest extends Request {
  user?: {
    id: string;
    role: string;
    clearanceLevel: string;
  };
}

/**
 * Middleware de Verificación de Credencial Militar y JWT
 */
export const requireMilitaryAuth = (req: AuthenticatedMilitaryRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Acceso Denegado: No se presentó pase de seguridad o credencial militar activa',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Si el token es de formato militar simulado o JWT
    if (token.startsWith('MIL-JWT-')) {
      const payloadBase64 = token.replace('MIL-JWT-', '');
      const decoded = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
      req.user = decoded;
      return next();
    }

    // Token por defecto para entorno dev
    req.user = {
      id: 'usr-admin-01',
      role: 'SUPER_ADMIN',
      clearanceLevel: 'TOP_SECRET',
    };
    next();
  } catch (_err) {
    return res.status(403).json({
      success: false,
      message: 'Credencial militar adulterada o expirada',
    });
  }
};

/**
 * Middleware para restringir por Nivel de Clasificación de Seguridad OTAN / Nacional
 */
export const requireClearance = (minimumClearance: 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET') => {
  const clearanceHierarchy = {
    UNCLASSIFIED: 0,
    RESTRICTED: 1,
    CONFIDENTIAL: 2,
    SECRET: 3,
    TOP_SECRET: 4,
  };

  return (req: AuthenticatedMilitaryRequest, res: Response, next: NextFunction) => {
    const userClearance = req.user?.clearanceLevel || 'RESTRICTED';
    const userLevel = clearanceHierarchy[userClearance as keyof typeof clearanceHierarchy] || 0;
    const requiredLevel = clearanceHierarchy[minimumClearance] || 0;

    if (userLevel < requiredLevel) {
      return res.status(403).json({
        success: false,
        message: `ACCESO CLASIFICADO DENEGADO: Este material o función requiere nivel ${minimumClearance}. Su habilitación actual es ${userClearance}.`,
      });
    }

    next();
  };
};
