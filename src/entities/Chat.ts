import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Relation
} from 'typeorm';
import { ChatMessage } from './chat-message.ts';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 64 })
  title: string;

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.chat, {
    onDelete: 'CASCADE'
  })
  messages: Relation<ChatMessage[]>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
