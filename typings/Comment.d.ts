import { Document, Model } from "mongoose";
import { AuthorDocument } from "./Author";
import { StoryDocument } from "./Story";

//================ Comment

export interface Comment {
  story: StoryDocument;
  author: AuthorDocument;
  comment: string;
}

export interface CommentDocument extends Document, Comment {}

export interface CommentModelType extends Model<CommentDocument> {}
