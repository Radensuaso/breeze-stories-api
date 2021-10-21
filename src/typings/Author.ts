import { Document, Model } from "mongoose";

export interface Author {
  name: string;
  username: string;
  email: string;
  password: string;
  role: "Admin" | "Author";
  avatar: string;
  birthDate: Date;
  refreshToken: string;
}

export interface AuthorDocument extends Document, Author {}

export interface AuthorModelType extends Model<AuthorDocument> {
  checkCredentials(
    email: string,
    password: string
  ): Promise<AuthorDocument | null>;
}

// declare global {
//   namespace Express {
//     interface Request {
//       author: AuthorModel;
//     }
//   }
// }
