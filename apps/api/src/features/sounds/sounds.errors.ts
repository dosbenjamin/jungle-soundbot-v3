export const SoundsErrorCode = {
  NameAlreadyUsed: 'Sounds.NameAlreadyUsed',
} as const;
export type SoundsErrorCode = (typeof SoundsErrorCode)[keyof typeof SoundsErrorCode];
