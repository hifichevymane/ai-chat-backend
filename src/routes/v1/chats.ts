import { Router } from 'express';

import {
  getAllChats,
  getChatById,
  createChat,
  generatePromptResponse
} from '../../controllers/chats/index.ts';

const router = Router();

router.get('/', getAllChats);
router.get('/:id', getChatById);
router.post('/', createChat);
router.patch('/:id/prompt', generatePromptResponse);

export default router;