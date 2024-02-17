import { Data } from 'effect';

export class ApiProviderError extends Data.TaggedError('ApiProviderError') {}
