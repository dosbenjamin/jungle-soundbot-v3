import { Context, type Effect } from 'effect';
import { StorageError } from './storage.errors';
import type { UploadedFile } from './storage.types';

export class StorageProvider extends Context.Tag('StorageProvider')<
  StorageProvider,
  {
    readonly putFile: (blob: Blob) => Effect.Effect<UploadedFile, StorageError>;
    readonly deleteFile: (id: string) => Effect.Effect<void, StorageError>;
    readonly getFileUrl: (id: string) => Effect.Effect<string>;
  }
>() {}
