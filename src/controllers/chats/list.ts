import type { Request, Response } from 'express';
import { ChatService } from '../../services';
import { HttpError } from '../http-error';

export const list = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const chatService = new ChatService();
  const userId = req.user.id;
  const chats = await chatService.getAllChats(userId);

  res.status(200).json(chats);
};
