import { Context, type Effect } from 'effect';
import { StorageError } from './storage.errors';
import type { SignedUploadedFile, UploadedFile } from './storage.types';

export class StorageProvider extends Context.Tag('StorageProvider')<
  StorageProvider,
  {
    readonly putFile: (blob: Blob) => Effect.Effect<UploadedFile, StorageError>;
    readonly deleteFile: (id: string) => Effect.Effect<void, StorageError>;
    readonly getSignedFileUrl: (id: string) => Effect.Effect<SignedUploadedFile, StorageError>;
  }
>() {}
