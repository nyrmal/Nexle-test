import { AuthRequest } from '@shared/utils/request.interface';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header('Authorization');

    if (!token) return res.status(400).json({ msg: 'Invalid Authentication.' });

    const decode: any = jwt.verify(
      token.split(' ')[1],
      process.env.ACCESS_TOKEN_SECRET,
    );

    if (!decode)
      return res.status(400).json({ msg: 'Invalid Authentication.' });

    req.userId = decode.id;

    next();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
