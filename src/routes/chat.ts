// @deno-types="@types/express"
import { Request, Response, Router } from 'express';
import '@std/dotenv/load';
import ollama from 'ollama';
import { Chat } from '../entities/Chat.entity.ts';
import { DatabaseSource } from '../database.ts';
import { ChatMessage } from '../entities/ChatMessage.ts';

import { MODEL_ID } from '../constants.ts';

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
  id: string
}

type ChatPromptRequest = Request<
  EmptyObject,
  ChatPromptResponseBody | ErrorResponseBody,
  ChatPromptRequestBody,
  ChatPromptQuery
>;

router.post('/chat', async (_, res: Response) => {
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

router.patch('/chat/:id/prompt', async (req: ChatPromptRequest, res: Response) => {
  const chatRepository = DatabaseSource.getRepository(Chat);
  let currentChat: Chat | null = null;
  const { id } = req.query;

  try {
    currentChat = await chatRepository.findOneByOrFail({ id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: `The chat with id: ${id} wasn't found` });
    return;
  }

  try {
    const { prompt } = req.body;

    const messages: ChatMessage[] = [...currentChat.context, { role: 'user', content: prompt }];
    const stream = await ollama.chat({
      model: MODEL_ID,
      messages,
      stream: true,
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
});

export default router;
