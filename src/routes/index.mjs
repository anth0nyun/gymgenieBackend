import { Router } from 'express';
import workoutsRouter from './workouts.mjs';
import sessionsRouter from './sessions.mjs';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
    res.json({ ok: true, ts: new Date().toISOString() });
});

// Mount feature routers (empty handlers for Day 1)
router.use('/workouts', workoutsRouter);
router.use('/sessions', sessionsRouter);

export default router;
