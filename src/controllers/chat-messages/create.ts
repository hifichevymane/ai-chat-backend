import { Request, Response } from 'express';
import { ChatMessageService } from '../../services/chat-message';

export const create = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const chatMessageService = new ChatMessageService();
    const { content } = req.body as { content: string };
    const chatMessage = await chatMessageService.createAndInsertMessage(
      id,
      content
    );
    res.status(201).json(chatMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
