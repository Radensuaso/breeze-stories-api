import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage, Options } from "multer-storage-cloudinary";

//================ Avatars

export const saveAvatarCloudinary = new CloudinaryStorage({
  cloudinary,
  params: { folder: "breezeStories/avatars", format: "png" },
} as Options);

//=================== Story Images

export const saveStoryImageCloudinary = new CloudinaryStorage({
  cloudinary,
  params: { folder: "breezeStories/storyImages", format: "png" },
} as Options);
