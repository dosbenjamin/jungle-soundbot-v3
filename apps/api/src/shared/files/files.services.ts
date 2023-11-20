import { UploadedFile } from './files.types';

export const uploadFile = (): UploadedFile => {
  // const arrayBuffer = await file.arrayBuffer().then(({ byteLength }) => byteLength.toString());
  // return cloudinary.uploader.unsigned_upload(arrayBuffer, 'jyeiofw9', {
  //   folder: env.CLOUDINARY_FOLDER_NAME,
  //   resource_type: 'raw',
  // })
  // .then((file) => ({ url: file.url }));
  return {
    url: 'todo',
  };
};
