import { Router } from 'express';

import {
  list,
  show,
  create,
  generateLLMResponse,
  createUserMessage
} from '../../controllers/chats';

const router = Router();

router.get('/', list);
router.get('/:id', show);
router.post('/', create);
router.post('/:id/user-message', createUserMessage);
router.post('/:id/generate-llm-response', generateLLMResponse);

export default router;
