import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 64 })
  title: string;

  @Column('jsonb', { nullable: true })
  context: string;
}
