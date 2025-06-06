// @deno-types="@types/express"
import { Request, Response } from 'express';
import { getRepository } from '../../database/index.ts';
import { Chat } from '../../database/entities/Chat.ts';

export const getChatById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const chatRepository = getRepository(Chat);
    const chat = await chatRepository.findOneByOrFail({ id });
    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: `The record with id ${id} was not found` });
  }
};
