import { authMiddleware } from '@app/middlewares/auth.middleware';
import { validationMiddleware } from '@app/middlewares/validation.middleware';
import { UsersController } from '@controllers/user.controller';
import { UserInputDto } from '@dtos/userInput.dto';
import { UserLoginInputDto } from '@dtos/userLoginInput.dto';
import { Router } from 'express';

class UsersRoute {
  public path = '';
  public router = Router();

  private usersController: UsersController;

  constructor() {
    this.usersController = new UsersController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.route('/heath-check').get(this.usersController.heathCheck);
    this.router
      .route('/sign-up')
      .post(
        validationMiddleware(UserInputDto, 'body', true),
        this.usersController.signUp,
      );

    this.router
      .route('/sign-in')
      .post(
        validationMiddleware(UserLoginInputDto, 'body', true),
        this.usersController.signIn,
      );

    this.router
      .route('/sign-out')
      .post(authMiddleware, this.usersController.signOut);

    this.router.route('/refresh-token').post(this.usersController.refreshToken);
  }
}

export const usersRoute = new UsersRoute();
