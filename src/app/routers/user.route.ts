import { UsersController } from '@controllers/user.controller';
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
    // this.router.route('/heath-check').get(this.usersController.heathCheck);
    this.router.route('/sign-up').post(this.usersController.signUp);
  }
}

export const usersRoute = new UsersRoute();
