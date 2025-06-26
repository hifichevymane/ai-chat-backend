import type { Request, Response } from 'express';
import { ChatService } from '../../services';
import { ChatMessageRoleEnum } from '../../database/prisma/src/generated/prisma';

export const createUserMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { message } = req.body as { message: string };

    const chatService = new ChatService();
    const chatMessage = await chatService.createMessage(
      id,
      message,
      ChatMessageRoleEnum.user
    );
    res.status(201).json(chatMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
