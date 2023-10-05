import { Knex, knex } from 'knex';
import { Request, Response } from 'express';
import knexConfig from '../../shared/configs/database.config';
import { UserInputDto } from '@dtos/userInput.dto';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { UserOuputDto } from '@dtos/userOutput.dto';
import { validate } from 'class-validator';

export class UsersController {
  private knex: Knex;

  constructor() {
    this.knex = knex(knexConfig);
  }

  public heathCheck = async (req: Request, res: Response): Promise<void> => {
    try {
      this.knex.raw('SELECT 1');

      res.status(200).json('heath check success!');
    } catch (error) {
      throw new Error('Error!');
    }
  };

  public signUp = async (req: Request, res: Response): Promise<void> => {
    try {
      const userInput = new UserInputDto();
      userInput.email = req.body.email;
      userInput.firstName = req.body.firstName;
      userInput.lastName = req.body.lastName;
      userInput.password = req.body.password;

      const errors = await validate(userInput);
      if (errors.length) {
        res.status(400).send('Input is wrong format');
      }

      const hash: string = await bcrypt.hash(userInput.password, 1);
      const saveUser = { ...userInput, hash };
      delete saveUser.password;

      let user = await this.knex('Users').insert(saveUser);
      let responseData: any = await this.knex
        .select('*')
        .from('Users')
        .where('id', user[0]);

      res.status(201).json(
        plainToClass(
          UserOuputDto,
          {
            ...responseData[0],
            displayName: responseData[0].firstName + responseData[0].lastName,
          },
          { excludeExtraneousValues: true },
        ),
      );
    } catch (error) {
      throw new Error("can't sign in");
    }
  };
}
