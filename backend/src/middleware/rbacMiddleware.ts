import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware'; // Assuming AuthenticatedRequest is defined in authMiddleware

export const checkRole = (roleOrRoles: string | string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.app_metadata || !req.user.app_metadata.user_role) {
      return res.status(403).json({ error: 'Forbidden. User role not available.' });
    }

    const userRole = req.user.app_metadata.user_role;
    const requiredRoles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];

    if (requiredRoles.includes(userRole)) {
      next();
    } else {
      return res.status(403).json({ error: 'Forbidden. Insufficient permissions.' });
    }
  };
};
