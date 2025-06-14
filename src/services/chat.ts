import { Repository } from 'typeorm';
import { getRepository } from '../database';
import { Chat } from '../entities/chat';

export class ChatService {
  private readonly chatRepository: Repository<Chat> = getRepository(Chat);

  public async getAllChats(): Promise<Chat[]> {
    return await this.chatRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  public async getChatById(id: string): Promise<Chat | null> {
    return await this.chatRepository.findOne({
      where: { id },
      relations: { messages: true }
    });
  }

  public async createAndInsertEmptyChat(): Promise<Chat> {
    const chat = this.chatRepository.create({
      title: 'New Chat'
    });
    await this.chatRepository.insert(chat);
    return chat;
  }
}
