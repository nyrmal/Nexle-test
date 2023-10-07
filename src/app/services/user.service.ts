import { Knex, knex } from 'knex';
import { Request, Response } from 'express';
import knexConfig from '@shared/configs/database.config';
import { UserInputDto } from '@dtos/userInput.dto';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { UserOutputDto } from '@dtos/userOutput.dto';
import { UserLoginInputDto } from '@dtos/userLoginInput.dto';
import { UserLoginOutputDto } from '@dtos/userLoginOutput.dto';
import { createAccessToken, createRefreshToken } from '@shared/utils/tokens';
import { REFRESH_TOKEN_EXPIRE } from '@shared/utils/constant';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { TokenOutputDto } from '@dtos/tokenOutput.dto';
import { Request as JWTRequest } from 'express-jwt';

export class UsersService {
  private knex: Knex;

  constructor() {
    this.knex = knex(knexConfig);
  }

  public heathCheck = async (req: Request, res: Response): Promise<boolean> => {
    try {
      await this.knex
        .raw('SELECT 1')
        .then(() => {
          console.log('Mysql connected');
        })
        .catch((e) => {
          console.log('Mysql not connected');
        });

      return true;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public signUp = async (
    req: Request,
    res: Response,
  ): Promise<UserOutputDto> => {
    try {
      const userInput: UserInputDto = req.body;

      const emailExist = await this.knex
        .select('*')
        .from('users')
        .where('email', userInput.email)
        .first();

      // Validate if the email is available for the signup or not.
      if (emailExist) {
        res.status(400).json({ error: 'Email already exists' });
        return;
      }

      // Encrypt password
      const hash: string = await bcrypt.hash(userInput.password, 12);
      const saveUser = {
        ...userInput,
        hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      delete saveUser.password;

      const [id] = await this.knex('users').insert(saveUser);
      const responseData = await this.knex
        .select('*')
        .from('users')
        .where('id', id)
        .first();

      return plainToClass(
        UserOutputDto,
        {
          ...responseData,
          displayName: `${responseData.firstName} ${responseData.lastName}`,
        },
        { excludeExtraneousValues: true },
      );
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public signIn = async (
    req: Request,
    res: Response,
  ): Promise<UserLoginOutputDto> => {
    try {
      const userInput: UserLoginInputDto = req.body;

      const user = await this.knex
        .select('*')
        .from('users')
        .where('email', userInput.email)
        .first();

      if (!user) {
        res.status(400).json({ error: "Email doesn't exist" });
        return;
      }
      const isMatch = await bcrypt.compare(userInput.password, user.hash);

      if (!isMatch) {
        res.status(400).json({ error: "Password don't match" });
        return;
      }

      const token = createAccessToken({ id: user.id });
      const refreshToken = createRefreshToken({ id: user.id });

      const now = new Date();
      const tokenData = {
        userId: user.id,
        refreshToken,
        expiresIn: `${now.setDate(now.getDate() + REFRESH_TOKEN_EXPIRE)}`,
        createdAt: now,
        updatedAt: now,
      };

      const tokenExist = await this.knex
        .select('*')
        .from('tokens')
        .where('userId', user.id)
        .first();

      // update old token or create new
      if (tokenExist) {
        await this.knex('tokens').where('userId', user.id).update(tokenData);
      } else {
        await this.knex('tokens').insert(tokenData);
      }

      return plainToClass(
        UserLoginOutputDto,
        {
          user: {
            ...user,
            displayName: `${user.firstName} ${user.lastName}`,
          },
          token,
          refreshToken,
        },
        { excludeExtraneousValues: true },
      );
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  };

  public signOut = async (req: JWTRequest, res: Response): Promise<boolean> => {
    try {
      const userId = req.auth.id;

      await this.knex('tokens').where('userId', userId).del();

      return true;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public refreshToken = async (
    req: Request,
    res: Response,
  ): Promise<TokenOutputDto> => {
    try {
      const rfToken = req.body.refreshToken;
      if (!rfToken) {
        res.status(404).json({ error: 'refresh token invalid' });
        return;
      }

      jwt.verify(
        rfToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err: JsonWebTokenError, result) => {
          if (err) {
            res.status(400).json({ error: 'Please login' });
            return;
          }

          const token = createAccessToken({ id: result.id });
          const refreshToken = createRefreshToken({ id: result.id });

          const now = new Date();
          const tokenData = {
            userId: result.id,
            refreshToken,
            expiresIn: `${now.setDate(now.getDate() + REFRESH_TOKEN_EXPIRE)}`,
            createdAt: now,
            updatedAt: now,
          };

          const tokenExist = await this.knex
            .select('*')
            .from('tokens')
            .where('userId', result.id)
            .first();

          // update old token or create new
          if (tokenExist) {
            await this.knex('tokens')
              .where('userId', result.id)
              .update(tokenData);
          } else {
            await this.knex('tokens').insert(tokenData);
          }

          res.status(200).json(
            plainToClass(
              TokenOutputDto,
              {
                token,
                refreshToken,
              },
              { excludeExtraneousValues: true },
            ),
          );
        },
      );
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
