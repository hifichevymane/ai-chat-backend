import { describe, it, expect, beforeEach, vi } from 'vitest';
import { faker } from '@faker-js/faker';
import { ChatMessageRoleEnum } from '../enums';

import prisma from '../__mocks__/database';
vi.mock('../database', () => ({ prisma }));

import { ChatService } from './chat';

let chatService: ChatService;

describe('ChatService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    chatService = new ChatService();
  });

  describe('getAllChats', () => {
    it('should return all chats for a user', async () => {
      const userId = faker.string.uuid();
      const records = [
        {
          id: faker.string.uuid(),
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          title: faker.lorem.sentence()
        },
        {
          id: faker.string.uuid(),
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          title: faker.lorem.sentence()
        },
        {
          id: faker.string.uuid(),
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          title: faker.lorem.sentence()
        }
      ];
      prisma.chat.findMany.mockResolvedValue(records);

      const chats = await chatService.getAllChats(userId);
      expect(chats).toEqual(records);
      expect(chats).toEqual(records.filter((r) => r.userId === userId));
      expect(prisma.chat.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
    });
  });

  describe('getChatById', () => {
    it('should return a chat by id', async () => {
      const chatId = faker.string.uuid();
      const userId = faker.string.uuid();
      const chat = {
        id: chatId,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: faker.lorem.sentence()
      };
      prisma.chat.findUnique.mockResolvedValue(chat);

      const result = await chatService.getChatById(chatId, userId);
      expect(result).toEqual(chat);
      expect(prisma.chat.findUnique).toHaveBeenCalledWith({
        where: { id: chatId, userId },
        include: { chatMessages: true }
      });
    });

    it('should return null if the chat is not found', async () => {
      prisma.chat.findUnique.mockResolvedValue(null);

      const chatId = faker.string.uuid();
      const userId = faker.string.uuid();
      const result = await chatService.getChatById(chatId, userId);
      expect(result).toBeNull();
      expect(prisma.chat.findUnique).toHaveBeenCalledWith({
        where: { id: chatId, userId },
        include: { chatMessages: true }
      });
    });
  });

  describe('createEmptyChat', () => {
    it('should create an empty chat', async () => {
      const userId = faker.string.uuid();
      const chat = {
        id: faker.string.uuid(),
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: 'New Chat'
      };
      prisma.chat.create.mockResolvedValue(chat);

      const result = await chatService.createEmptyChat(userId);
      expect(result).toEqual(chat);
      expect(prisma.chat.create).toHaveBeenCalledWith({
        data: {
          title: 'New Chat',
          user: { connect: { id: userId } }
        }
      });
    });
  });

  describe('createMessage', () => {
    it('should create a message', async () => {
      const chatId = faker.string.uuid();
      const userId = faker.string.uuid();

      chatService.getChatById = vi.fn().mockResolvedValue({
        id: chatId,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: faker.lorem.sentence(),
        chatMessages: []
      });

      const messageDTO = {
        content: faker.lorem.sentence(),
        role: ChatMessageRoleEnum.user
      };
      const message = {
        id: faker.string.uuid(),
        chatId,
        createdAt: new Date(),
        ...messageDTO
      };
      prisma.chatMessage.create.mockResolvedValue(message);

      const result = await chatService.createMessage(
        chatId,
        userId,
        messageDTO
      );
      expect(result).toEqual(message);
      expect(prisma.chatMessage.create).toHaveBeenCalledWith({
        data: {
          chatId,
          ...messageDTO
        }
      });
    });
  });
});
