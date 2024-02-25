export type UploadedFile = {
  id: string;
};

export type SignedUploadedFile = UploadedFile & {
  url: string;
};
