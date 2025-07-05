import type { Request, Response } from 'express';
import { ChatService } from '../../services';
import { HttpError } from '../http-error';

export const create = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const chatService = new ChatService();
  const userId = req.user.id;
  const chat = await chatService.createEmptyChat(userId);
  res.status(201).json(chat);
};
