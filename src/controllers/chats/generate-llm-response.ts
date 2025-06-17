import type { Request, Response } from 'express';
import { LLMService, ChatService } from '../../services';

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

export const generateLLMResponse = async (
  req: ChatPromptRequest,
  res: Response
): Promise<void> => {
  try {
    const chatService = new ChatService();
    const { id } = req.params;
    const currentChat = await chatService.getChatById(id);

    if (!currentChat) {
      res.status(200).json({ message: `The chat with id ${id} was not found` });
      return;
    }

    const { prompt } = req.body;
    await chatService.createAndInsertMessage(currentChat.id, prompt);

    const llmService = new LLMService();
    const stream = await llmService.streamPromptResponse(
      prompt,
      currentChat.chatMessages
    );

    const responseChunks = [];
    for await (const chunk of stream) {
      res.write(chunk.message.content);
      responseChunks.push(chunk.message.content);
    }

    const { content, role } = llmService.responseFromChunks(responseChunks);
    await chatService.createAndInsertMessage(currentChat.id, content, role);

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
