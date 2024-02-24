export const SoundErrorCode = {
  NameAlreadyUsed: 'Sound.NameAlreadyUsed',
} as const;
export type SoundErrorCode = (typeof SoundErrorCode)[keyof typeof SoundErrorCode];
