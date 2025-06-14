import { Router } from 'express';

import { list, show, create, addPrompt } from '../../controllers/chats';

const router = Router();

router.get('/', list);
router.get('/:id', show);
router.post('/', create);
router.patch('/:id/prompt', addPrompt);

export default router;
