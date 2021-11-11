import mongoose from "mongoose";
import { CommentDocument } from "../../../typings/Comment";

const { Schema } = mongoose;
const CommentSchema = new Schema<CommentDocument>(
  {
    story: { type: Schema.Types.ObjectId, required: true, ref: "story" },
    author: { type: Schema.Types.ObjectId, required: true, ref: "author" },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Showing json without __v
CommentSchema.methods.toJSON = function () {
  const commentObject: any = this.toObject();
  delete commentObject.__v;
  return commentObject;
};

export default CommentSchema;
