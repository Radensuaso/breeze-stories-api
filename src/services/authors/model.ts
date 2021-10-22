import mongoose from "mongoose";
import AuthorSchema from "./schema";
import { AuthorDocument, AuthorModelType } from "src/typings/Author";

const { model } = mongoose;

const AuthorModel = model<AuthorDocument, AuthorModelType>(
  "Author",
  AuthorSchema
);

export default AuthorModel;