import { Document, Model } from "mongoose";

export interface Author {
  name: string;
  authorname: string;
  email: string;
  password: string;
  role: "Admin" | "Author";
  avatar: string;
  birthDate: Date;
  bio: string;
  refreshToken: string;
  googleId: string;
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