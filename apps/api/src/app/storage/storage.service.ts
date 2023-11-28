import { Context, Effect } from 'effect';
import { StorageError } from './storage.errors';
import { SignedUploadedFile, UploadedFile } from './storage.types';

export interface StorageService {
  readonly putFile: (blob: Blob) => Effect.Effect<never, StorageError, UploadedFile>;
  readonly getSignedFileUrl: (id: string) => Effect.Effect<never, StorageError, SignedUploadedFile>;
}

export const StorageService = Context.Tag<StorageService>('@app/storage.service');
