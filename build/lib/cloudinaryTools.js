"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveStoryImageCloudinary = exports.saveAvatarCloudinary = void 0;
var cloudinary_1 = require("cloudinary");
var multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
//================= Cloudinary config
process.env.TS_NODE_DEV && require("dotenv").config();
if (!process.env.CLOUD_NAME) {
    throw new Error("No Cloudinary name.");
}
if (!process.env.CLOUD_KEY) {
    throw new Error("No Cloudinary key.");
}
if (!process.env.CLOUD_SECRET) {
    throw new Error("No Cloudinary secret.");
}
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});
//================ Avatars
exports.saveAvatarCloudinary = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: { folder: "breezeStories/avatars", format: "png" },
});
//=================== Story Images
exports.saveStoryImageCloudinary = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: { folder: "breezeStories/storyImages", format: "png" },
});
