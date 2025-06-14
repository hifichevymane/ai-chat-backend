import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const databaseSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'ai_chat',
  synchronize: false,
  logging: false,
  entities: ['src/entities/*.ts'],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: ['src/database/subscribers/*.ts'],
  namingStrategy: new SnakeNamingStrategy()
});
