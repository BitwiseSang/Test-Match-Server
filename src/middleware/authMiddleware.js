import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

function authenticate(requiredRole) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);

      // Optional role checking
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      req.user = decoded; // add to request object
      next();
    } catch {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}

export default authenticate;
