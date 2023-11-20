import { database } from '@app/database';
import { uploadFile } from '@shared/files/files.services';
import { NewSound, soundsTable } from './sounds.schema';

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
