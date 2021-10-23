import mongoose from "mongoose";
import StorySchema from "./schema";
import { StoryDocument, StoryModelType } from "../../../typings/Story";

const { model } = mongoose;

const StoryModel = model<StoryDocument, StoryModelType>("story", StorySchema);

export default StoryModel;
