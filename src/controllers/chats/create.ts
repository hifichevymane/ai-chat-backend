import type { Request, Response } from 'express';
import { ChatService } from '../../services';

export const create = async (_: Request, res: Response): Promise<void> => {
  try {
    const chatService = new ChatService();
    const chat = await chatService.createAndInsertEmptyChat();
    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
