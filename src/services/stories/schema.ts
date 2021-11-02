import mongoose from "mongoose";
import { StoryDocument } from "../../../typings/Story";

const { Schema } = mongoose;

const StorySchema = new Schema<StoryDocument>(
  {
    author: { type: Schema.Types.ObjectId, required: true, ref: "author" },
    title: { type: String, required: true },
    categories: {
      type: [String],
      validate: (v: void) => Array.isArray(v) && v.length > 0,
      enum: [
        "Mystery",
        "Thriller",
        "Horror",
        "Historical",
        "Romance",
        "Sci-fi",
        "Fantasy",
        "Dystopian",
      ],
    },
    story: { type: String, required: true },
    hearts: { type: [Schema.Types.ObjectId], ref: "author", required: true },
    storyImage: { type: String },
  },
  {
    timestamps: true,
  }
);

// Showing json without __v
StorySchema.methods.toJSON = function () {
  const storyObject: any = this.toObject();
  delete storyObject.__v;
  return storyObject;
};

export default StorySchema;
