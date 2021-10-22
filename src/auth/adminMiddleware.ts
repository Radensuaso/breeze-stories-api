import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.author.role === "Admin") {
    next();
  } else {
    next(createHttpError(403, "Admins only!"));
  }
};

export default adminMiddleware;
