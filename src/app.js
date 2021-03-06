import 'dotenv/config'; // Import env config

import express from 'express';
import 'express-async-errors'; // Catch the error's in async functions
import Youch from 'youch';
import * as Sentry from '@sentry/node'; // Service to get error's when app was in production
import cors from 'cors';
import routes from './routes';
import sentryConfig from './config/sentry';
import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig); // Init the service sentry

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler()); // Catch any errors in aplication
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        // In development show the error catched more detailed
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    });
  }
}

export default new App().server;
