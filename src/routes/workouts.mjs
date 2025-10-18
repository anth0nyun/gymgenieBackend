import { Router } from 'express';
import {
    listWorkouts,
    getWorkout,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkoutTags,
    getWorkoutMeta,
} from '../controllers/workoutController.mjs';

const router = Router();

// helpers
router.get('/tags', getWorkoutTags);
router.get('/meta', getWorkoutMeta);

// CRUD
router.get('/', listWorkouts);
router.get('/:id', getWorkout);
router.post('/', createWorkout);
router.patch('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

export default router;
