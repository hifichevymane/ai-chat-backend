import type { Request, Response } from 'express';
import { ChatService } from '../../services';

export const list = async (_: Request, res: Response): Promise<void> => {
  try {
    const chatService = new ChatService();
    const chats = await chatService.getAllChats();
    res.status(200).json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Error' });
  }
};
