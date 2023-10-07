import { Payload } from '@shared/utils/payload.interface';
import { AuthRequest } from '@shared/utils/request.interface';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { plainToClass } from 'class-transformer';

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token: string = req.header('Authorization');

    if (!token) return res.status(400).json({ msg: 'Invalid Authentication.' });

    const decode = jwt.verify(
      token.split(' ')[1],
      process.env.ACCESS_TOKEN_SECRET,
    );

    if (!decode)
      return res.status(400).json({ msg: 'Invalid Authentication.' });

    req.auth = plainToClass(Payload, decode);

    next();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
