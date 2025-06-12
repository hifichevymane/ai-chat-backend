import { DataSource } from 'typeorm';

export const DatabaseSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'ai_chat',
  synchronize: false,
  logging: false,
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts']
});

export const initializeDB = async (): Promise<void> => {
  try {
    await DatabaseSource.initialize();
    console.log('Database connection established');
  } catch (err) {
    console.error('Error connecting to database:', err);
    throw err;
  }
};
