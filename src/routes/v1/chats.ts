import { Router } from 'express';

import {
  list,
  show,
  create,
  generateLLMResponse,
  createUserMessage
} from '../../controllers/chats';

import {
  showParamsSchema,
  createUserMessageParamsSchema,
  createUserMessageBodySchema,
  generateLLMResponseParamsSchema
} from '../../controllers/chats/schemas';

import {
  authenticateJWT,
  validateParams,
  validateBody
} from '../../middlewares';

const router = Router();

router.get('/', authenticateJWT, list);
router.get('/:id', [authenticateJWT, validateParams(showParamsSchema)], show);
router.post('/', authenticateJWT, create);
router.post(
  '/:id/user-message',
  [
    authenticateJWT,
    validateParams(createUserMessageParamsSchema),
    validateBody(createUserMessageBodySchema)
  ],
  createUserMessage
);
router.post(
  '/:id/generate-llm-response',
  [authenticateJWT, validateParams(generateLLMResponseParamsSchema)],
  generateLLMResponse
);

export default router;
