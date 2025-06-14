import { Router } from 'express';

import {
  list,
  show,
  create,
  generateLLMResponse
} from '../../controllers/chats';

const router = Router();

router.get('/', list);
router.get('/:id', show);
router.post('/new', create);
router.post('/:id/generate-llm-response', generateLLMResponse);

export default router;
