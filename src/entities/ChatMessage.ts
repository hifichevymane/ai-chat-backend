import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne
} from 'typeorm';
import { Chat } from './Chat';

export enum Role {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ type: 'varchar', length: 255 })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

export type ChatMessageDTO = Pick<ChatMessage, 'role' | 'content'>;
