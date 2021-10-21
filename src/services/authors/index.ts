import express from "express";
import AuthorModel from "./model";
import { saveAvatarCloudinary } from "src/lib/cloudinaryTools";
import multer from "multer";
import { tokenMiddleware } from "src/auth/tokenMiddleware";
import createHttpError from "http-errors";
import { generateJWTToken } from "src/auth/tokenTools";

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
authorsRouter.post("/register", async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel({ ...req.body, role: "Author" });
    const savedAuthor = await newAuthor.save();
    res.status(201).send(savedAuthor);
  } catch (error) {
    next(error);
  }
});

//======================= Login author
authorsRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const author = await AuthorModel.checkCredentials(username, password);
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

// //==================== Post an avatar to an author.
// authorsRouter.post(
//   "/avatar",
//   tokenMiddleware,
//   multer({ storage: saveAvatarCloudinary }).single("avatar"),
//   async (req, res, next) => {
//     try {
//       const authorId = req.author._id;
//       const avatarUrl = req.file?.path;

//       const updatedAuthor = await AuthorModel.findByIdAndUpdate(
//         authorId,
//         {
//           avatar: avatarUrl,
//         },
//         { new: true }
//       );
//       res.send(updatedAuthor);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

export default authorsRouter;
