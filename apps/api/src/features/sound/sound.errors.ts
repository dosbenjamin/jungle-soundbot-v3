export const SoundErrorCode = {
  NameAlreadyUsed: 'Sounds.NameAlreadyUsed',
} as const;
export type SoundErrorCode = (typeof SoundErrorCode)[keyof typeof SoundErrorCode];
