import { z } from 'zod';

export const FileSchema = z.instanceof(File).openapi({ format: 'binary', type: 'string' });
