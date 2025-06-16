import { prisma } from '../database';
import type {
  chats as Chat,
  chat_messages as ChatMessage
} from '../database/prisma/src/generated/prisma';
import { chat_messages_role_enum as Role } from '../database/prisma/src/generated/prisma';

type ChatWithMessages = Chat & {
  chat_messages: ChatMessage[];
};

export class ChatService {
  public getAllChats(): Promise<Chat[]> {
    return prisma.chats.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });
  }

  public getChatById(id: string): Promise<ChatWithMessages | null> {
    return prisma.chats.findUnique({
      where: { id },
      include: {
        chat_messages: true
      }
    });
  }

  public createAndInsertEmptyChat(): Promise<Chat> {
    return prisma.chats.create({
      data: {
        title: 'New Chat'
      }
    });
  }

  public async createAndInsertMessage(
    chatId: string,
    content: string,
    role: Role = Role.user
  ): Promise<ChatMessage> {
    const chat = await prisma.chats.findUnique({
      where: { id: chatId }
    });

    if (!chat) throw new Error(`The chat with id ${chatId} doesn't exist`);

    return await prisma.chat_messages.create({
      data: {
        content,
        role,
        chat_id: chatId
      }
    });
  }
}
