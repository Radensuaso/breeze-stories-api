import mongoose from "mongoose";
import StorySchema from "./schema";
import { StoryDocument, StoryModelType } from "../../types/Story";

const { model } = mongoose;

const StoryModel = model<StoryDocument, StoryModelType>("story", StorySchema);

export default StoryModel; 
