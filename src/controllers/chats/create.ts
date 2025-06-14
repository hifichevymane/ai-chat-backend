import { Request, Response } from 'express';
import { getRepository } from '../../database';
import { Chat } from '../../entities/Chat';

export const create = async (_: Request, res: Response): Promise<void> => {
  try {
    const chat = new Chat();
    chat.title = 'New Chat';
    const chatRepository = getRepository(Chat);
    await chatRepository.save(chat);
    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
