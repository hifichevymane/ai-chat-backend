import type { Request, Response } from 'express';
import { ChatService } from '../../services';

export const list = async (_: Request, res: Response): Promise<void> => {
  const chatService = new ChatService();
  const chats = await chatService.getAllChats();
  res.status(200).json(chats);
};
