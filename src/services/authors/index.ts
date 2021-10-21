import express from "express";
import createHttpError from "http-errors";
import AuthorModel from "./model";

const authorsRouter = express.Router();

//==================  Get all Authors with queries
authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await AuthorModel.find();
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

//===================  Register new author
authorsRouter.post("register", async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body);
    const savedAuthor = await newAuthor.save();
    res.status(201).send(savedAuthor);
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
