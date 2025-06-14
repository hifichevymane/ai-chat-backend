import { Repository } from 'typeorm';
import { Chat } from '../entities/Chat';
import { getRepository } from '../database';

export class ChatService {
  private chatRepository: Repository<Chat> = getRepository(Chat);

  public async getAllChats(): Promise<Chat[]> {
    return await this.chatRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  public async getChatById(id: string): Promise<Chat | null> {
    return await this.chatRepository.findOneBy({ id });
  }

  public async createEmptyChat(): Promise<Chat> {
    const chat = new Chat();
    chat.title = 'New Chat';
    await this.chatRepository.save(chat);
    return chat;
  }
}
