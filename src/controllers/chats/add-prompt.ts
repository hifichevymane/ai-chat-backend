import ollama from 'ollama';
import { Request, Response } from 'express';
import { getRepository } from '../../database';
import { Chat } from '../../entities/Chat';
import { ChatMessage } from '../../interfaces/ChatMessage';

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

export const addPrompt = async (
  req: ChatPromptRequest,
  res: Response
): Promise<void> => {
  const chatRepository = getRepository(Chat);
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
      model: process.env.MODEL_ID,
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
};
