import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage, Options } from "multer-storage-cloudinary";

//================ Avatars

export const saveAvatarCloudinary = new CloudinaryStorage({
  cloudinary,
  folder: "breezeStories/avatars",
} as Options);

//=================== Story Images

export const saveStoryImageCloudinary = new CloudinaryStorage({
  cloudinary,
  folder: "breezeStories/storyImages",
} as Options);
