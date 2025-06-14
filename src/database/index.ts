import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

const databaseSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'ai_chat',
  synchronize: true,
  logging: false,
  entities: ['src/entities/*.ts'],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: ['src/database/subscribers/*.ts']
});

export const getRepository = <Entity extends ObjectLiteral>(
  target: EntityTarget<Entity>
): Repository<Entity> => {
  return databaseSource.getRepository(target);
};

export const initializeDatabase = async (): Promise<void> => {
  await databaseSource.initialize();
  console.log('Database connection established');
};
