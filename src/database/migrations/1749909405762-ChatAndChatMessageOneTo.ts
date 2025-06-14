import { MigrationInterface, QueryRunner } from "typeorm";

export class ChatAndChatMessageOneTo1749909405762 implements MigrationInterface {
    name = 'ChatAndChatMessageOneTo1749909405762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD "chat_id" uuid`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_9f5c0b96255734666b7b4bc98c3" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_9f5c0b96255734666b7b4bc98c3"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP COLUMN "chat_id"`);
    }

}
