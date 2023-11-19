import { database } from '@app';
import { uploadFile } from '@shared';
import { NewSound, soundsTable } from './schema';

export const createSound = async (newSound: NewSound) => {
  const { url } = uploadFile();

  const [sound] = await database
    .insert(soundsTable)
    .values({ ...newSound, url })
    .returning({
      id: soundsTable.id,
      name: soundsTable.name,
      author: soundsTable.author,
      url: soundsTable.url,
    });

  return sound;
};
