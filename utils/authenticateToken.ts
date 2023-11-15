import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export interface RequestWithUser extends NextApiRequest {
  user?: any;
}

export const authenticateToken = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    throw new Error('Unauthorized');
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as RequestWithUser).user = user;
  } catch (err) {
    res.status(403).json({ message: 'Forbidden, invalid token' });
    throw new Error('Forbidden, invalid token');
  }
};
