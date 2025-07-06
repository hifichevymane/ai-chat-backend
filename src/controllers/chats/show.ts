import type { Request, Response } from 'express';
import { ChatService } from '../../services';
import { HttpError } from '../http-error';
import type { ShowRequestParams } from './schemas';

export const show = async (
  req: Request<ShowRequestParams>,
  res: Response
): Promise<void> => {
  if (!req.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const { id } = req.params;
  const chatService = new ChatService();
  const userId = req.user.id;
  const chat = await chatService.getChatById(id, userId);

  if (!chat) {
    throw new HttpError(404, `The chat with id ${id} was not found`);
  }

  res.status(200).json(chat);
};
