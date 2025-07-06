import type { Request, Response } from 'express';
import { LLMService, ChatService } from '../../services';
import { HttpError } from '../http-error';
import type { GenerateLLMResponseRequestParams } from './schemas';

export const generateLLMResponse = async (
  req: Request<GenerateLLMResponseRequestParams>,
  res: Response
): Promise<void> => {
  if (!req.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const chatService = new ChatService();
  const { id } = req.params;
  const userId = req.user.id;
  const currentChat = await chatService.getChatById(id, userId);

  if (!currentChat) {
    throw new HttpError(404, `The chat with id ${id} was not found`);
  }

  const llmService = new LLMService(process.env.MODEL_ID);

  const currentChatMessages = currentChat.chatMessages;
  const { content: lastMessageContent } =
    currentChatMessages[currentChatMessages.length - 1];

  const stream = await llmService.streamPromptResponse(
    lastMessageContent,
    currentChatMessages
  );

  const responseChunks = [];
  for await (const chunk of stream) {
    res.write(chunk.message.content);
    responseChunks.push(chunk.message.content);
  }

  const { content, role } = llmService.responseFromChunks(responseChunks);
  const messageContent = { content, role };
  await chatService.createMessage(currentChat.id, userId, messageContent);

  res.end();
};
