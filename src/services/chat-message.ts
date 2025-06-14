import { Repository } from 'typeorm';
import { getRepository } from '../database';
import { ChatMessage, Role } from '../entities/chat-message';
import { Chat } from '../entities/chat';

export class ChatMessageService {
  private readonly chatMessageRepository: Repository<ChatMessage> =
    getRepository(ChatMessage);
  private readonly chatRepository: Repository<Chat> = getRepository(Chat);

  public async createAndInsertMessage(
    chatId: string,
    content: string,
    role: Role = Role.USER
  ): Promise<ChatMessage> {
    const chat = await this.chatRepository.findOneBy({ id: chatId });
    if (!chat) throw new Error(`The chat with id ${chatId} doesn't exist`);

    const message = this.chatMessageRepository.create({ chat, content, role });
    await this.chatMessageRepository.insert(message);
    return message;
  }
}
