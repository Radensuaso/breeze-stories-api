import { Document, Model } from "mongoose";
import { AuthorDocument } from "./Author";
import { StoryDocument } from "./Story";

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
  storyId: StoryDocument;
  author: AuthorDocument;
  content: string;
  image: string;
  hearts: AuthorDocument[];
  subComments: SubCommentDocument[];
}

export interface CommentDocument extends Document, Comment {}

export interface CommentModelType extends Model<CommentDocument> {}
