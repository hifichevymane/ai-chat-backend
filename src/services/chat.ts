import { prisma } from '../database';
import {
  type Chat,
  type ChatMessage,
  ChatMessageRoleEnum
} from '../database/prisma/src/generated/prisma';

type ChatWithMessages = Chat & {
  chatMessages: ChatMessage[];
};

export class ChatService {
  public getAllChats(): Promise<Chat[]> {
    return prisma.chat.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  public getChatById(id: string): Promise<ChatWithMessages | null> {
    return prisma.chat.findUnique({
      where: { id },
      include: {
        chatMessages: true
      }
    });
  }

  public createAndInsertEmptyChat(): Promise<Chat> {
    return prisma.chat.create({
      data: {
        title: 'New Chat'
      }
    });
  }

  public async createAndInsertMessage(
    chatId: string,
    content: string,
    role: ChatMessageRoleEnum = ChatMessageRoleEnum.user
  ): Promise<ChatMessage> {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId }
    });

    if (!chat) throw new Error(`The chat with id ${chatId} doesn't exist`);

    return await prisma.chatMessage.create({
      data: {
        content,
        role,
        chatId
      }
    });
  }
}
