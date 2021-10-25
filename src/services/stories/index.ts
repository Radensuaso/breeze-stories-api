import express from "express";
import StoryModel from "./model";
import AuthorModel from "../authors/model";
import { saveStoryImageCloudinary } from "../../lib/cloudinaryTools";
import multer from "multer";
import { tokenMiddleware } from "../../auth/tokenMiddleware";
import adminMiddleware from "../../auth/adminMiddleware";
import createHttpError from "http-errors";

const storiesRouter = express.Router();

//================== Get all stories, with queries
storiesRouter.get("/", async (req, res, next) => {
  try {
    const stories = await StoryModel.find().populate("author");
    res.send(stories);
  } catch (error) {
    next(error);
  }
});

//================ Post a new Story.
storiesRouter.post("/", tokenMiddleware, async (req, res, next) => {
  try {
    const authorId = req.author._id;
    const newStory = new StoryModel({ ...req.body, author: authorId });
    await newStory.save();
    res.send(newStory);
  } catch (error) {
    next(error);
  }
});

//==================Get all my stories.
storiesRouter.get("/me", tokenMiddleware, async (req, res, next) => {
  try {
    const authorId = req.author._id;
    const stories = await StoryModel.find({ author: authorId });
    res.send(stories);
  } catch (error) {
    next(error);
  }
});

//===================Get all Stories from an Author.
storiesRouter.get("/author/:authorId", async (req, res, next) => {
  try {
    const { authorId } = req.params;
    const author = await AuthorModel.findById(authorId);
    console.log(authorId);

    if (author) {
      const stories = await StoryModel.find({ author: author._id });
      res.send(stories);
    } else {
      next(
        createHttpError(404, `Author with the id: ${authorId} was not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

//=======================Get one Story at random.
storiesRouter.get("/random", async (req, res, next) => {
  try {
    StoryModel.count().exec(function (err, count) {
      const random = Math.floor(Math.random() * count);

      StoryModel.findOne()
        .skip(random)
        .exec(function (err, result) {
          res.send(result);
        });
    });
  } catch (error) {
    next(error);
  }
});

// //====================Post an image to the Story.
// storiesRouter.post(
//     "/avatar",
//     tokenMiddleware,
//     multer({ storage: saveStoryImageCloudinary }).single("storyImage"),
//     async (req, res, next) => {
//       try {
//         const authorId = req.author._id;
//         console.log(authorId);

//         const avatarUrl = req.file?.path;
//         const updatedAuthor = await AuthorModel.findByIdAndUpdate(
//           authorId,
//           {
//             avatar: avatarUrl,
//           },
//           { new: true }
//         );
//         res.send(updatedAuthor);
//       } catch (error) {
//         next(error);
//       }
//     }
//   );
export default storiesRouter;
