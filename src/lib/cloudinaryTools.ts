import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage, Options } from 'multer-storage-cloudinary';
import 'dotenv/config';

//================= Cloudinary config

if (!process.env.CLOUD_NAME) {
    throw new Error('No Cloudinary name.');
}
if (!process.env.CLOUD_KEY) {
    throw new Error('No Cloudinary key.');
}
if (!process.env.CLOUD_SECRET) {
    throw new Error('No Cloudinary secret.');
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

//================ Avatars

export const saveAvatarCloudinary = new CloudinaryStorage({
    cloudinary,
    params: { folder: 'breezeStories/avatars', format: 'png' },
} as Options);

//=================== Story Images

export const saveStoryImageCloudinary = new CloudinaryStorage({
    cloudinary,
    params: { folder: 'breezeStories/storyImages', format: 'png' },
} as Options);
