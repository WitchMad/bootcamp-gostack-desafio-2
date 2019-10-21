import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegisterController from './app/controllers/RegisterController';
import CheckController from './app/controllers/CheckController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.post('/students/:id/checkins', CheckController.store);
routes.get('/students/:id/checkins', CheckController.index);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/register', RegisterController.store);
routes.get('/register', RegisterController.index);
routes.put('/register/:id', RegisterController.update);
routes.delete('/register/:id', RegisterController.delete);

export default routes;
