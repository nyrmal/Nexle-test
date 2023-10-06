import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';

export const validationMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return async (req, res, next) => {
    const errors: ValidationError[] = await validate(
      plainToInstance(type, req[value]),
      {
        skipMissingProperties,
        whitelist,
        forbidNonWhitelisted,
      },
    );

    if (errors.length > 0) {
      const message = errors
        .map((error: ValidationError) => Object.values(error.constraints))
        .join(', ');

      next(res.status(400).json({ error: message }));
    } else {
      next();
    }
  };
};
