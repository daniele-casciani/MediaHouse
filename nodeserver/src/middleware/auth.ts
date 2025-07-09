import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

export const tokenRequired = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });

  const token = authHeader.split(' ')[1];

  try {
    const introspectionRes = await axios.post(
      process.env.ZITADEL_INTROSPECTION_URL!,
      new URLSearchParams({ token }),
      {
        auth: {
          username: process.env.API_CLIENT_ID!,
          password: process.env.API_CLIENT_SECRET!,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!introspectionRes.data.active) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const decoded = jwt.decode(token, { json: true });
    if (!decoded) return res.status(403).json({ message: 'Token decoding failed' });

    (req as any).user = decoded; // Attach to request object
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Token introspection failed', error });
  }
};
