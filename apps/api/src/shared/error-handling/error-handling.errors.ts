import { Data } from 'effect';

export const NotFoundErrorCode = {
  NotFound: 'General.NotFound',
} as const;
export type NotFoundErrorCode = (typeof NotFoundErrorCode)[keyof typeof NotFoundErrorCode];

export class NotFoundError extends Data.TaggedError('NotFoundError')<{
  message: string;
}> {
  public readonly errorCode = NotFoundErrorCode.NotFound;
}

export class BusinessError<ErrorCode extends string> extends Data.TaggedError('BusinessError')<{
  errorCode: ErrorCode;
  message: string;
}> {}
