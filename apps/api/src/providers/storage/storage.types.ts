import type { StorageErrorCode } from './storage.errors';

export type UploadedFile = {
  id: string;
};

export type SignedUploadedFile = UploadedFile & {
  url: string;
};

export type StorageErrorInvokationOptions = {
  errorCode: StorageErrorCode;
  defaultMessage: string;
};
