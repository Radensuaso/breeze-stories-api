import { Document, Model } from "mongoose";
import { AuthorDocument } from "./Author";

export interface Story {
  author: AuthorDocument;
  title: string;
  categories: string[];
  story: string;
  hearts: AuthorDocument[];
  storyImage: string;
}

export interface StoryDocument extends Document, Story {}

export interface StoryModelType extends Model<StoryDocument> {}
