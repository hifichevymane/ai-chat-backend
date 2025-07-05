import type { Request, Response } from 'express';
import { LLMService, ChatService } from '../../services';
import { HttpError } from '../http-error';

export const generateLLMResponse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const chatService = new ChatService();
  const { id } = req.params;
  const userId = (req.user as { id: string }).id;
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
  await chatService.createMessage(currentChat.id, content, role);

  res.end();
};
