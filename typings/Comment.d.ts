import { Document, Model } from "mongoose";
import { AuthorDocument } from "./Author";

//============= Sub Comment

export interface SubComment {
  author: AuthorDocument;
  content: string;
  image: string;
  hearts: AuthorDocument[];
}

export interface SubCommentDocument extends Document, SubComment {}

export interface SubCommentModelType extends Model<SubCommentDocument> {}

//================ Comment

export interface Comment {
  storyId: string;
  author: AuthorDocument;
  content: string;
  image: string;
  hearts: AuthorDocument[];
  subComments: SubCommentDocument[];
}

export interface CommentDocument extends Document, Comment {}

export interface CommentModelType extends Model<CommentDocument> {}
