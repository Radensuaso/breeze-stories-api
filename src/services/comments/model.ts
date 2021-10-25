import mongoose from "mongoose";
import CommentSchema from "./schema";
import { CommentDocument, CommentModelType } from "../../../typings/Comment";

const { model } = mongoose;

const StoryModel = model<CommentDocument, CommentModelType>(
  "comment",
  CommentSchema
);

export default StoryModel;
