import { UsersService } from '@services/user.service';
import { Request, Response } from 'express';
import { Request as JWTRequest } from 'express-jwt';

export class UsersController {
  private service: UsersService;

  constructor() {
    this.service = new UsersService();
  }

  public heathCheck = async (req: Request, res: Response): Promise<void> => {
    await this.service.heathCheck(req, res);

    res.status(200).json('Heath check success!');
  };

  public signUp = async (req: Request, res: Response): Promise<void> => {
    const user = await this.service.signUp(req, res);

    res.status(201).json(user);
  };

  public signIn = async (req: Request, res: Response): Promise<void> => {
    const data = await this.service.signIn(req, res);

    res.status(200).json(data);
  };

  public signOut = async (req: JWTRequest, res: Response): Promise<void> => {
    await this.service.signOut(req, res);

    res.status(204).json('ok!');
  };

  public refreshToken = async (req: Request, res: Response) => {
    await this.service.refreshToken(req, res);
  };
}
