import { eq } from 'drizzle-orm';
import { database } from '@app/database';
import { uploadFile } from '@app/storage';
import { NewSound, Sound } from './sounds.schemas';
import { sound } from './sounds.model';

export const getSounds = (): Promise<Sound[]> => database.query.sounds.findMany().execute();

export const getSoundByName = (name: string): Promise<Sound | undefined> => {
  return database.query.sounds.findFirst({ where: eq(sound.name, name) }).execute();
};

export const createSound = async ({ file, ...newSound }: NewSound): Promise<Sound | undefined> => {
  const { id } = await uploadFile(file);

  const [createdSound] = await database
    .insert(sound)
    .values({ ...newSound, objectId: id })
    .returning();

  return createdSound;
};
