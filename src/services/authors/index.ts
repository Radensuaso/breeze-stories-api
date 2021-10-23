import express from "express";
import AuthorModel from "./model";
import { saveAvatarCloudinary } from "../../lib/cloudinaryTools";
import multer from "multer";
import { tokenMiddleware } from "../../auth/tokenMiddleware";
import adminMiddleware from "../../auth/adminMiddleware";
import createHttpError from "http-errors";
import { generateJWTToken } from "../../auth/tokenTools";
import StoryModel from "../stories/model";
import { ObjectId } from "mongoose";

const authorsRouter = express.Router();

//==================  Get all Authors with queries
authorsRouter.get("/", async (req, res, next) => {
  try {
    const { name } = req.query;
    console.log(name);

    if (name) {
      const regex = new RegExp(["^", name].join(""), "i");
      const searchedAuthors = await AuthorModel.find({
        name: regex,
      });
      res.send(searchedAuthors);
    } else {
      const authors = await AuthorModel.find({ name: { $exists: true } }).sort({
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
      res.status(201).send(newAuthor);
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
      console.log(authorId);

      const avatarUrl = req.file?.path;
      const updatedAuthor = await AuthorModel.findByIdAndUpdate(
        authorId,
        {
          avatar: avatarUrl,
        },
        { new: true }
      );
      res.send(updatedAuthor);
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

//=================== Edit my profile
authorsRouter.put("/me", tokenMiddleware, async (req, res, next) => {
  try {
    const { email } = req.body;
    const author = await AuthorModel.findOne({ email });
    if (!author) {
      const authorId = req.author._id;
      const me = await AuthorModel.findByIdAndUpdate(authorId, req.body, {
        new: true,
      });
      res.send(me);
    } else {
      next(createHttpError(409, "Email already in use."));
    }
  } catch (error) {
    next(error);
  }
});

//=================== Delete my profile.
authorsRouter.delete("/me", tokenMiddleware, async (req, res, next) => {
  try {
    const authorId = req.author._id;
    const me = await AuthorModel.findByIdAndDelete(authorId);
    await StoryModel.deleteMany({ author: authorId });
    res.send({ message: "You deleted your account.", me });
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

//===================== Enable an admin to delete an author
authorsRouter.delete(
  "/:authorId/admin",
  tokenMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    try {
      const authorId = req.params.authorId;
      const author = await AuthorModel.findByIdAndDelete(authorId);
      if (author) {
        // const authorIdObject = ObjectId(authorId);
        // await StoryModel.deleteMany({ author: authorIdObject });
        res.send({ message: "Author Account was deleted.", author });
      } else {
        next(createHttpError(404, "Author not Found."));
      }
    } catch (error) {
      next(error);
    }
  }
);

export default authorsRouter;
