"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const CommentSchema = new Schema({
    story: { type: Schema.Types.ObjectId, required: true, ref: 'story' },
    author: { type: Schema.Types.ObjectId, required: true, ref: 'author' },
    comment: { type: String, required: true },
}, {
    timestamps: true,
});
// Showing json without __v
CommentSchema.methods.toJSON = function () {
    const commentObject = this.toObject();
    delete commentObject.__v;
    return commentObject;
};
exports.default = CommentSchema;
