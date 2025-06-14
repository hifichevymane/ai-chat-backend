import { Request, Response } from 'express';
import { getRepository } from '../../database';
import { Chat } from '../../entities/Chat';

export const list = async (_: Request, res: Response): Promise<void> => {
  try {
    const chatRepository = getRepository(Chat);
    const chats = await chatRepository.find({
      order: { createdAt: 'DESC' }
    });
    res.status(200).json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Error' });
  }
};
