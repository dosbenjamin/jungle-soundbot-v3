import { downloadFile } from '@app/storage';
import { BufferString } from './files.schemas';

export const getBufferStringById = async (id: string): Promise<BufferString | undefined> => {
  const file = await downloadFile(id);
  const bufferString = file?.buffer.toString();
  return bufferString ? { id, bufferString } : undefined;
};
