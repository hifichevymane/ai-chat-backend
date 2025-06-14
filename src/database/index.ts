import { EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { databaseSource } from './data-source';

export const getRepository = <Entity extends ObjectLiteral>(
  target: EntityTarget<Entity>
): Repository<Entity> => {
  return databaseSource.getRepository(target);
};

export const initializeDatabase = async (): Promise<void> => {
  await databaseSource.initialize();
  console.log('Database connection established');
};
