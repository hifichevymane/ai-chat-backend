import { Repository } from 'typeorm';
import { getRepository } from '../database';
import { ChatMessage } from '../entities/ChatMessage';
import { Chat } from '../entities/Chat';

export class ChatMessageService {
  private readonly chatMessageRepository: Repository<ChatMessage> =
    getRepository(ChatMessage);
  private readonly chatRepository: Repository<Chat> = getRepository(Chat);

  public async createAndInsertMessage(
    chatId: string,
    content: string
  ): Promise<ChatMessage> {
    const chat = await this.chatRepository.findOneBy({ id: chatId });
    if (!chat) throw new Error(`The chat with id ${chatId} doesn't exist`);

    const message = this.chatMessageRepository.create({ chat, content });
    await this.chatMessageRepository.insert(message);
    return message;
  }
}
