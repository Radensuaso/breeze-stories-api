"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var CommentSchema = new Schema({
    story: { type: Schema.Types.ObjectId, required: true, ref: "story" },
    author: { type: Schema.Types.ObjectId, required: true, ref: "author" },
    comment: { type: String, required: true },
}, {
    timestamps: true,
});
// Showing json without __v
CommentSchema.methods.toJSON = function () {
    var commentObject = this.toObject();
    delete commentObject.__v;
    return commentObject;
};
exports.default = CommentSchema;
