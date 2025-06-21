import { Router } from 'express';
import { healthCheck } from '../controllers/health-check';
import v1 from './v1';

const router = Router();

router.get('/health-check', healthCheck);
router.use('/v1', v1);

export default router;
