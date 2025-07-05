import type { Request, Response } from 'express';
import { ChatService } from '../../services';

export const create = async (req: Request, res: Response): Promise<void> => {
  const chatService = new ChatService();
  const userId = (req.user as { id: string }).id;
  const chat = await chatService.createEmptyChat(userId);
  res.status(201).json(chat);
};
