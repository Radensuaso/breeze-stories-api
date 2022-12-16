"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const StorySchema = new Schema({
    author: { type: Schema.Types.ObjectId, required: true, ref: 'author' },
    title: { type: String, required: true },
    categories: {
        type: [String],
        validate: (v) => Array.isArray(v) && v.length > 0,
        enum: [
            'Mystery',
            'Thriller',
            'Horror',
            'Historical',
            'Romance',
            'Sci-fi',
            'Fantasy',
            'Dystopian',
        ],
    },
    story: { type: String, required: true },
    hearts: { type: [Schema.Types.ObjectId], ref: 'author', required: true },
    storyImage: { type: String },
}, {
    timestamps: true,
});
// Showing json without __v
StorySchema.methods.toJSON = function () {
    const storyObject = this.toObject();
    delete storyObject.__v;
    return storyObject;
};
exports.default = StorySchema;
