import { prisma } from '../database';
import type {
  Chat,
  ChatMessage
} from '../database/prisma/src/generated/prisma';

type ChatWithMessages = Chat & {
  chatMessages: ChatMessage[];
};

type MessageDTO = Pick<ChatMessage, 'content' | 'role'>;

export class ChatService {
  public getAllChats(): Promise<Chat[]> {
    return prisma.chat.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  public getChatById(
    id: string,
    userId: string
  ): Promise<ChatWithMessages | null> {
    return prisma.chat.findUnique({
      where: { id, userId },
      include: {
        chatMessages: true
      }
    });
  }

  public createEmptyChat(userId: string): Promise<Chat> {
    return prisma.chat.create({
      data: {
        title: 'New Chat',
        user: { connect: { id: userId } }
      }
    });
  }

  public async createMessage(
    chatId: string,
    userId: string,
    message: MessageDTO
  ): Promise<ChatMessage> {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId, userId }
    });

    if (!chat) throw new Error(`The chat with id ${chatId} doesn't exist`);

    return await prisma.chatMessage.create({
      data: {
        chatId,
        ...message
      }
    });
  }
}
