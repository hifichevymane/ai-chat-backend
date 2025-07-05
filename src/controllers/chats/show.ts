import type { Request, Response } from 'express';
import { ChatService } from '../../services';
import { HttpError } from '../http-error';

export const show = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const chatService = new ChatService();
  const userId = (req.user as { id: string }).id;
  const chat = await chatService.getChatById(id, userId);

  if (!chat) {
    throw new HttpError(404, `The chat with id ${id} was not found`);
  }

  res.status(200).json(chat);
};
