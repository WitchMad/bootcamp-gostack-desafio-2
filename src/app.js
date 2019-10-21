import express from 'express';
import * as Sentry from '@sentry/node'; // Service to get error's when app was in production
import routes from './routes';
import sentryConfig from './config/sentry';
import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig); // Init the service sentry

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler()); // Catch any errors in aplication
  }
}

export default new App().server;
