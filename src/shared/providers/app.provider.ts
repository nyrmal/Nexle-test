import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { usersRoute } from '@routers/user.route';
import * as dotenv from 'dotenv';
dotenv.config();

class AppProvider {
  public app: express.Application;

  constructor() {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port: ${process.env.PORT}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes() {
    this.app.use(usersRoute.path, usersRoute.router);
  }
}

export const appProvider = new AppProvider();
