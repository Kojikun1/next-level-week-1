import express from 'express';

const routes = express.Router();

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

routes.get('/items', ItemsController.index);

routes.get('/points', PointsController.index);
routes.post('/points', PointsController.create);
routes.get('/points/:id', PointsController.show);
  

export default routes;

