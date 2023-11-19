import { database } from '@app';
import { soundsTable } from '..';
import { eq } from 'drizzle-orm';

export const getSounds = () => database.query.sounds.findMany();

export const getSoundByName = (name: string) => {
  return database.query.sounds.findFirst({
    where: eq(soundsTable.name, name),
  });
};
