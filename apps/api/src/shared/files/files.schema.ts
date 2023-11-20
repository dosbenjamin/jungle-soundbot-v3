import { z } from 'zod';

export const FileSchema = z.instanceof(Blob, { fatal: false });
