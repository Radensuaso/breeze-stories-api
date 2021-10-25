import mongoose from "mongoose";
import { SubCommentDocument, CommentDocument } from "../../../typings/Comment";

const { Schema } = mongoose;

const SubCommentSchema = new Schema<SubCommentDocument>(
  {
    author: { type: Schema.Types.ObjectId, required: true, ref: "author" },
    subComment: { type: String, required: true },
    hearts: { type: [Schema.Types.ObjectId], required: true, ref: "author" },
  },
  { timestamps: true }
);

const CommentSchema = new Schema<CommentDocument>(
  {
    story: { type: Schema.Types.ObjectId, required: true, ref: "story" },
    author: { type: Schema.Types.ObjectId, required: true, ref: "author" },
    comment: { type: String, required: true },
    hearts: { type: [Schema.Types.ObjectId], required: true, ref: "author" },
    subComments: { type: [SubCommentSchema] },
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
