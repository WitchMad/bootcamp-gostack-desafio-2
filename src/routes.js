import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegisterController from './app/controllers/RegisterController';
import CheckController from './app/controllers/CheckController';
import HelpController from './app/controllers/HelpController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.post('/students/:id/checkins', CheckController.store);
routes.get('/students/:id/checkins', CheckController.index);
routes.post('/students/:id/help-orders', HelpController.store);

routes.use(authMiddleware);

routes.get('/students/:id/help-orders', HelpController.index);
routes.get('/students/help-orders', HelpController.index);
routes.post('/students/:id/answer', HelpController.update);

routes.post('/students', StudentController.store);
routes.get('/students', StudentController.index);
routes.delete('/students/:id', StudentController.delete);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/register', RegisterController.store);
routes.get('/register', RegisterController.index);
routes.put('/register/:id', RegisterController.update);
routes.delete('/register/:id', RegisterController.delete);

export default routes;
