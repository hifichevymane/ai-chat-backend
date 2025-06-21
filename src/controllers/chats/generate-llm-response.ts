import type { Request, Response } from 'express';
import { LLMService, ChatService } from '../../services';

export const generateLLMResponse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const chatService = new ChatService();
    const { id } = req.params;
    const currentChat = await chatService.getChatById(id);

    if (!currentChat) {
      res.status(404).json({ message: `The chat with id ${id} was not found` });
      return;
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
    await chatService.createAndInsertMessage(currentChat.id, content, role);

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
