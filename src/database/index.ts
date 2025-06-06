import '@std/dotenv/load';
import { DataSource } from 'typeorm';
import { Chat } from './entities/Chat.ts';
import { User } from './entities/User.ts';

const databaseSource = new DataSource({
  type: 'postgres',
  host: Deno.env.get('DB_HOST') || 'localhost',
  port: parseInt(Deno.env.get('DB_PORT') || '5432'),
  username: Deno.env.get('DB_USERNAME'),
  password: Deno.env.get('DB_PASSWORD'),
  database: Deno.env.get('DB_DATABASE') || 'ai_chat',
  synchronize: true,
  logging: false,
  entities: [Chat, User],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: ['src/database/subscribers/*.ts'],
});
export const getRepository = databaseSource.getRepository;

export const initializeDB = async () => {
  try {
    await databaseSource.initialize();
    console.log('Database connection established');
  } catch (err) {
    console.error('Error connecting to database:', err);
    throw err;
  }
};
