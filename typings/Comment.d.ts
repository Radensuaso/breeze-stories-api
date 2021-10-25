import { Document, Model } from "mongoose";
import { AuthorDocument } from "./Author";
import { StoryDocument } from "./Story";

//============= Sub Comment

export interface SubComment {
  author: AuthorDocument;
  subComment: string;
  hearts: AuthorDocument[];
}

export interface SubCommentDocument extends Document, SubComment {}

//================ Comment

export interface Comment {
  story: StoryDocument;
  author: AuthorDocument;
  comment: string;
  hearts: AuthorDocument[];
  subComments: SubCommentDocument[];
}

export interface CommentDocument extends Document, Comment {}

export interface CommentModelType extends Model<CommentDocument> {}
