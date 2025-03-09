// @deno-types="@types/express"
import { Request, Response, Router } from 'express';
import '@std/dotenv/load';
import ollama from 'ollama';
import { Chat } from '../entities/Chat.ts';
import { DatabaseSource } from '../database.ts';

import { MODEL_ID } from '../constants.ts';

const router = Router();

type EmptyObject = Record<string | number | symbol, never>;

interface ChatRequestBody {
  prompt: string;
}

interface ChatResponseBody {
  message: string | null;
}

interface ErrorResponseBody {
  error: string;
}

type ChatRequest = Request<
  EmptyObject,
  ChatResponseBody | ErrorResponseBody,
  ChatRequestBody
>;

router.post('/chat', async (req: ChatRequest, res: Response) => {
  try {
    const { prompt } = req.body;

    const stream = await ollama.chat({
      model: MODEL_ID,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      res.write(chunk.message.content);
    }
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/create-chat', async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const chat = new Chat();
    chat.title = title;

    const chatRepository = DatabaseSource.getRepository(Chat);
    const result = await chatRepository.save(chat);

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
