import { Router } from 'express';
const router = Router();

router.get('/', (_req, res) => {
    res.json({ message: 'Sessions endpoint ready' });
});

export default router;
