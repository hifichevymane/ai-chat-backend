import { Router } from 'express';
import { update, show, deleteUser } from '../../controllers/users';
import {
  authenticateJWT,
  validateParams,
  validateBody
} from '../../middlewares';

import {
  showUserParamsSchema,
  updateUserParamsSchema,
  updateUserBodySchema,
  deleteUserParamsSchema
} from '../../controllers/users/schemas';

const router = Router();

router.get(
  '/:id',
  [authenticateJWT, validateParams(showUserParamsSchema)],
  show
);

router.patch(
  '/:id',
  [
    authenticateJWT,
    validateParams(updateUserParamsSchema),
    validateBody(updateUserBodySchema)
  ],
  update
);

router.delete(
  '/:id',
  [authenticateJWT, validateParams(deleteUserParamsSchema)],
  deleteUser
);

export default router;
