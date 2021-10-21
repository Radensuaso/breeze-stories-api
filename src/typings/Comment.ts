import { Document, Model } from "mongoose";
import { AuthorDocument } from "./Author";

//============= Sub Comment

export interface SubComment {
  author: AuthorDocument;
  comment: string;
  image: string;
  hearts: AuthorDocument[];
}

export interface SubCommentDocument extends Document, SubComment {}

export interface SubCommentModelType extends Model<SubCommentDocument> {}

//================ Comment

export interface Comment {
  story_id: string;
  author: AuthorDocument;
  comment: string;
  image: string;
  hearts: AuthorDocument[];
  subComments: SubCommentDocument[];
}

export interface CommentDocument extends Document, Comment {}

export interface CommentModelType extends Model<CommentDocument> {}
