// @deno-types="@types/express"
import { Request, Response } from 'express';
import { getRepository } from '../../database/index.ts';
import { Chat } from '../../database/entities/Chat.ts';

export const getAllChats = async (_: Request, res: Response) => {
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
