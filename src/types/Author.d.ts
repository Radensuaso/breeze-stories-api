import { Document, Model } from "mongoose";

export interface Author {
  name: string;
  email: string;
  password: string;
  avatar: string;
  birthDate: Date;
  gender: string;
  bio: string;
}

export interface AuthorDocument extends Document, Author {}

export interface AuthorModelType extends Model<AuthorDocument> {
  checkCredentials(
    username: string,
    password: string
  ): Promise<AuthorDocument | null>;
}

//=============== Decoded token typing
export interface DecodedToken {
  _id: string;
}

//=============== declare global req
interface Path {
  path: string;
}

declare global {
  namespace Express {
    interface Request {
      author: AuthorDocument;
      file?: Path;
    }
  }
}
