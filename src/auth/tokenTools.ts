import JWT from "jsonwebtoken";
import { DecodedToken, AuthorDocument } from "../../typings/Author";

process.env.TS_NODE_DEV && require("dotenv").config();
if (!process.env.JWT_SECRET) {
  throw new Error("No JWT Secret");
}
const JWTSecret = process.env.JWT_SECRET;

//============== Generate JWT Token
const generateJWT = (author: AuthorDocument) =>
  new Promise((resolve, reject) =>
    JWT.sign(
      { _id: author._id },
      JWTSecret,
      { expiresIn: "7 days" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    )
  );

export const generateJWTToken = async (author: AuthorDocument) => {
  const accessToken = await generateJWT(author);
  return accessToken;
};

//=================== Verify JWT Token

export const verifyJWTToken = async (token: string) => {
  return new Promise<DecodedToken>((resolve, reject) =>
    JWT.verify(token, JWTSecret, (err, decodedToken) => {
      if (err) {
        reject(err);
      } else {
        resolve(decodedToken as DecodedToken);
      }
    })
  );
};
