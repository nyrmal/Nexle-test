import { Request } from 'express';
import { Payload } from './payload.interface';

export interface AuthRequest extends Request {
  auth?: Payload;
}
