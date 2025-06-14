import { Request, Response } from 'express';
import { getRepository } from '../../database';
import { Chat } from '../../entities/Chat';

export const show = async (req: Request, res: Response): Promise<void> => {
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
