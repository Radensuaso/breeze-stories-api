import express from "express";
import AuthorModel from "./model";
import { saveAvatarCloudinary } from "../../lib/cloudinaryTools";
import multer from "multer";
import { tokenMiddleware } from "../../auth/tokenMiddleware";
import createHttpError from "http-errors";
import { generateJWTToken } from "../../auth/tokenTools";
import StoryModel from "../stories/model";
import CommentModel from "../comments/model";

const authorsRouter = express.Router();

//==================  Get all Authors with queries
authorsRouter.get("/", async (req, res, next) => {
  try {
    const { name } = req.query;

    if (name) {
      const regex = new RegExp(["^", name].join(""), "i");
      const searchedAuthors = await AuthorModel.find({
        name: regex,
      }).sort({
        name: 1,
      });
      res.send(searchedAuthors);
    } else {
      const authors = await AuthorModel.find().sort({
        name: 1,
      });
      res.send(authors);
    }
  } catch (error) {
    next(error);
  }
});

//===================  Register new author
authorsRouter.post("/register", async (req, res, next) => {
  try {
    const { email } = req.body;
    const author = await AuthorModel.findOne({ email });
    if (!author) {
      const newAuthor = new AuthorModel(req.body);
      await newAuthor.save();
      res.status(201).send({
        message: "You successfully created a profile.",
        author: newAuthor,
      });
    } else {
      next(createHttpError(409, "Email already in use."));
    }
  } catch (error) {
    next(error);
  }
});

//======================= Login author
authorsRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const author = await AuthorModel.checkCredentials(email, password);
    if (author) {
      const accessToken = await generateJWTToken(author);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials not correct."));
    }
  } catch (error) {
    next(error);
  }
});

//==================== Post an avatar to an author.
authorsRouter.post(
  "/avatar",
  tokenMiddleware,
  multer({ storage: saveAvatarCloudinary }).single("avatar"),
  async (req, res, next) => {
    try {
      const authorId = req.author._id;

      const avatar = req.file?.path;
      const updatedAuthor = await AuthorModel.findByIdAndUpdate(
        authorId,
        {
          avatar,
        },
        { new: true }
      );
      res.send({
        message: "You successfully posted an avatar to your profile.",
        author: updatedAuthor,
      });
    } catch (error) {
      next(error);
    }
  }
);

//==================  Get my profile.
authorsRouter.get("/me", tokenMiddleware, async (req, res, next) => {
  try {
    const authorId = req.author._id;
    const author = await AuthorModel.findById(authorId);
    res.send(author);
  } catch (error) {
    next(error);
  }
});

//=================== Update my profile
authorsRouter.put("/me", tokenMiddleware, async (req, res, next) => {
  try {
    const authorId = req.author._id;
    const me = await AuthorModel.findByIdAndUpdate(authorId, req.body, {
      new: true,
    });
    res.send({ message: "You updated your profile.", me });
  } catch (error) {
    next(error);
  }
});

//=================== Delete my profile.
authorsRouter.delete("/me", tokenMiddleware, async (req, res, next) => {
  try {
    const authorId = req.author._id;
    const author = await AuthorModel.findById(authorId);
    if (author) {
      await AuthorModel.deleteOne({ _id: author._id });
      await StoryModel.deleteMany({ author: author._id });
      await CommentModel.deleteMany({ author: author._id });

      res.send({ message: "You deleted your profile.", author });
    } else {
      next(createHttpError(404, "Author does not exist."));
    }
  } catch (error) {
    next(error);
  }
});

//==================== Get the profile of a single author.
authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
    const { authorId } = req.params;
    const author = await AuthorModel.findById(authorId);
    if (author) {
      res.send(author);
    } else {
      next(createHttpError(404, "Author not Found."));
    }
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
