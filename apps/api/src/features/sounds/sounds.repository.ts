import { database } from '@app/database';
import { getSignedFileUrl, putFile } from '@app/storage';
import { NewSound, Sound, SoundFilter } from './sounds.schemas';
import { soundModel } from './sounds.model';
import { eq, or } from 'drizzle-orm';

export const getSounds = async ({ name, author }: SoundFilter): Promise<Sound[]> => {
  const sounds = await database
    .select()
    .from(soundModel)
    .where(or(name ? eq(soundModel.name, name) : undefined, author ? eq(soundModel.author, author) : undefined))
    .execute();

  return Promise.all(
    sounds.map(async ({ fileId, ...sound }) => ({
      ...sound,
      fileUrl: (await getSignedFileUrl(fileId)).url,
    })),
  );
};

export const createSound = async ({ file, ...newSound }: NewSound): Promise<Sound | undefined> => {
  const { id } = await putFile(file);

  const [sound] = await database
    .insert(soundModel)
    .values({ ...newSound, fileId: id })
    .returning();

  return (
    sound && {
      id: sound.id,
      author: sound.author,
      createdAt: sound.createdAt,
      name: sound.name,
      fileUrl: (await getSignedFileUrl(sound.fileId)).url,
    }
  );
};
