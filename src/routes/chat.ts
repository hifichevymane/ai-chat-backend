import { Request, Response, Router } from 'express';
import ollama from 'ollama';
import { Chat } from '../entities/Chat.ts';
import { DatabaseSource } from '../database.ts';
import { ChatMessage } from '../interfaces/ChatMessage.ts';

const MODEL_ID = process.env.MODEL_ID;

const router = Router();

type EmptyObject = Record<string | number | symbol, never>;

interface ChatPromptRequestBody {
  prompt: string;
}

interface ChatPromptResponseBody {
  message: string | null;
}

interface ErrorResponseBody {
  error: string;
}

interface ChatPromptQuery {
  id: string;
}

type ChatPromptRequest = Request<
  EmptyObject,
  ChatPromptResponseBody | ErrorResponseBody,
  ChatPromptRequestBody,
  ChatPromptQuery
>;

router.get('/chats', async (_, res: Response) => {
  try {
    const chatRepository = DatabaseSource.getRepository(Chat);
    const chats = await chatRepository.find({
      order: { createdAt: 'DESC' }
    });
    res.status(200).json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Error' });
  }
});

router.get('/chats/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const chatRepository = DatabaseSource.getRepository(Chat);
    const chat = await chatRepository.findOneByOrFail({ id });
    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: `The record with id ${id} was not found` });
  }
});

router.post('/chats', async (_, res: Response) => {
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
});

router.patch(
  '/chats/:id/prompt',
  async (req: ChatPromptRequest, res: Response) => {
    const chatRepository = DatabaseSource.getRepository(Chat);
    let currentChat: Chat | null = null;
    const { id } = req.params;

    try {
      currentChat = await chatRepository.findOneByOrFail({ id });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: `The chat with id: ${id} wasn't found` });
    }

    if (!currentChat) return;

    try {
      const { prompt } = req.body;

      const messages: ChatMessage[] = [
        ...currentChat.context,
        { role: 'user', content: prompt }
      ];
      const stream = await ollama.chat({
        model: MODEL_ID,
        messages,
        stream: true
      });

      const responseChunks = [];
      for await (const chunk of stream) {
        res.write(chunk.message.content);
        responseChunks.push(chunk.message.content);
      }

      messages.push({ role: 'assistant', content: responseChunks.join('') });
      currentChat.context = messages;
      await chatRepository.save(currentChat);

      res.end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

export default router;
