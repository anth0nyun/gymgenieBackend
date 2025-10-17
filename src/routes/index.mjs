import { Router } from 'express';
import workoutsRouter from './workouts.mjs';

const api = Router();
api.use('/workouts', workoutsRouter);
export default api;
