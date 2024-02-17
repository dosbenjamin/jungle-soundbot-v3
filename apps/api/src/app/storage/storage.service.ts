import { Context, Effect, Option } from 'effect';
import { StorageError } from './storage.errors';
import { SignedUploadedFile, UploadedFile } from './storage.types';

export class StorageService extends Context.Tag('StorageService')<
  StorageService,
  {
    readonly putFile: (blob: Blob) => Effect.Effect<UploadedFile, StorageError>;
    readonly deleteFile: (id: string) => Effect.Effect<Option.Option<never>, StorageError>;
    readonly getSignedFileUrl: (id: string) => Effect.Effect<SignedUploadedFile, StorageError>;
  }
>() {}
