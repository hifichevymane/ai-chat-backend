import type { Request, Response } from 'express';
import { ChatService } from '../../services';

export const show = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const chatService = new ChatService();
    const chat = await chatService.getChatById(id);
    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: `The record with id ${id} was not found` });
  }
};
