import { Router } from 'express';

import {
  list,
  show,
  create,
  generateLLMResponse,
  createUserMessage
} from '../../controllers/chats';

import { authenticateJWT } from '../../middlewares';

const router = Router();

router.get('/', authenticateJWT, list);
router.get('/:id', authenticateJWT, show);
router.post('/', authenticateJWT, create);
router.post('/:id/user-message', authenticateJWT, createUserMessage);
router.post('/:id/generate-llm-response', authenticateJWT, generateLLMResponse);

export default router;
