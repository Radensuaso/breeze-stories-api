import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import AuthorModel from "../services/authors/model";
import { verifyJWTToken } from "./tokenTools";

export const tokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = await verifyJWTToken(token);
      const author = await AuthorModel.findById(decodedToken._id);
      if (author) {
        req.author = author;
        next();
      } else {
        next(createHttpError(404, "Author not found"));
      }
    } else {
      next(createHttpError(401, "Please provide credentials"));
    }
  } catch (error) {
    next(createHttpError(401, "Token not valid"));
  }
};
