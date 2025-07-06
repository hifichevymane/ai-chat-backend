import type { Request, Response } from 'express';
import { ChatService } from '../../services';
import { ChatMessageRoleEnum } from '../../enums';
import { HttpError } from '../http-error';
import type {
  CreateUserMessageRequestParams,
  CreateUserMessageRequestBody
} from './schemas';

export const createUserMessage = async (
  req: Request<
    CreateUserMessageRequestParams,
    unknown,
    CreateUserMessageRequestBody
  >,
  res: Response
): Promise<void> => {
  if (!req.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const { id } = req.params;

  const chatService = new ChatService();
  const userId = req.user.id;
  const chat = await chatService.getChatById(id, userId);
  if (!chat) {
    throw new HttpError(404, `The chat with id ${id} was not found`);
  }

  const { message } = req.body;
  const messageContent = {
    content: message,
    role: ChatMessageRoleEnum.user
  };
  const chatMessage = await chatService.createMessage(
    id,
    userId,
    messageContent
  );
  res.status(201).json(chatMessage);
};
