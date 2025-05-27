import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient';

export interface AuthenticatedRequest extends Request {
  user?: any; // Define a more specific type for user based on Supabase user object
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided or malformed token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ error: 'Invalid token.', details: error.message });
    }

    if (!data.user) {
        return res.status(401).json({ error: 'User not found for this token.' });
    }

    req.user = data.user;
    next();
  } catch (error: any) {
    console.error('Unexpected error during token verification:', error.message);
    return res.status(500).json({ error: 'Internal server error during authentication.', details: error.message });
  }
};
