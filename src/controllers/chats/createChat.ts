// @deno-types="@types/express"
import { Request, Response } from 'express';
import { DatabaseSource } from '../../database/index.ts';
import { Chat } from '../../database/entities/Chat.entity.ts';

export const createChat = async (_: Request, res: Response) => {
  try {
    const chat = new Chat();
    chat.title = 'New Chat';
    const chatRepository = DatabaseSource.getRepository(Chat);
    await chatRepository.save(chat);
    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
