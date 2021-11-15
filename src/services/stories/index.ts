import express from "express";
import StoryModel from "./model";
import AuthorModel from "../authors/model";
import CommentModel from "../comments/model";
import { saveStoryImageCloudinary } from "../../lib/cloudinaryTools";
import multer from "multer";
import { tokenMiddleware } from "../../auth/tokenMiddleware";
import createHttpError from "http-errors";

const storiesRouter = express.Router();

//================== Get all stories, with queries
storiesRouter.get("/", async (req, res, next) => {
  try {
    const title = req.query.title;
    const category = req.query.category as string[];
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 0;
    const regex = new RegExp([title].join(""), "i");
    if (title && category) {
      const searchedTitleCategoriesStories = await StoryModel.find({
        $and: [{ title: regex }, { categories: category }],
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author");
      res.send(searchedTitleCategoriesStories);
    } else if (title) {
      const searchedTitleStories = await StoryModel.find({
        title: regex,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author");
      res.send(searchedTitleStories);
    } else if (category) {
      const searchedCategoriesStories = await StoryModel.find({
        categories: category,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author");
      res.send(searchedCategoriesStories);
    } else {
      const stories = await StoryModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author");
      res.send(stories);
    }
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
    res
      .status(201)
      .send({ message: "You posted a new story.", story: newStory });
  } catch (error) {
    next(error);
  }
});

//==================Get all my stories.
storiesRouter.get("/me", tokenMiddleware, async (req, res, next) => {
  try {
    const authorId = req.author._id;
    const stories = await StoryModel.find({ author: authorId })
      .sort({
        createdAt: -1,
      })
      .populate("author");
    res.send(stories);
  } catch (error) {
    next(error);
  }
});

//==================== Get all stories I hearted.
storiesRouter.get("/hearts", tokenMiddleware, async (req, res, next) => {
  try {
    const authorId = req.author._id;
    const stories = await StoryModel.find({ hearts: authorId })
      .sort({
        createdAt: -1,
      })
      .populate("author");
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

    if (author) {
      const stories = await StoryModel.find({ author: author._id })
        .sort({
          createdAt: -1,
        })
        .populate("author");
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
        .populate("author")
        .exec(function (err, result) {
          res.send(result);
        });
    });
  } catch (error) {
    next(error);
  }
});

//====================Get one Story
storiesRouter.get("/:storyId", async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const story = await StoryModel.findById(storyId).populate("author");
    if (story) {
      res.send(story);
    } else {
      next(
        createHttpError(404, `The story with the id: ${storyId} was not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

//====================Post an image to the Story.
storiesRouter.post(
  "/:storyId/storyImage",
  tokenMiddleware,
  multer({ storage: saveStoryImageCloudinary }).single("storyImage"),
  async (req, res, next) => {
    try {
      const authorId = req.author._id;
      const { storyId } = req.params;

      const storyImage = req.file?.path;
      const updatedStory = await StoryModel.findOneAndUpdate(
        { _id: storyId, author: authorId },
        {
          storyImage,
        },
        { new: true }
      );
      if (updatedStory) {
        res.send({
          message: "You successfully posted an image to your story.",
          story: updatedStory,
        });
      } else {
        next(
          createHttpError(404, `Story with the id: ${storyId} was not found.`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

//=======================Update my Story.
storiesRouter.put("/:storyId/me", tokenMiddleware, async (req, res, next) => {
  try {
    const authorId = req.author._id;
    const { storyId } = req.params;

    const updatedStory = await StoryModel.findOneAndUpdate(
      { _id: storyId, author: authorId },
      req.body,
      { new: true }
    );
    if (updatedStory) {
      res.send({ message: "Your story was updated", story: updatedStory });
    } else {
      next(
        createHttpError(404, `The story with id: ${storyId} was not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

//=======================Delete my story
storiesRouter.delete(
  "/:storyId/me",
  tokenMiddleware,
  async (req, res, next) => {
    try {
      const authorId = req.author._id;
      const { storyId } = req.params;

      const story = await StoryModel.findOne({
        _id: storyId,
        author: authorId,
      });
      if (story) {
        await StoryModel.deleteOne({ _id: story._id });
        await CommentModel.deleteMany({ author: story._id });
        res.send({
          message: "Your story was deleted",
          story,
        });
      } else {
        next(
          createHttpError(404, `The story with id: ${storyId} was not found.`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

//=========================Post or remove a heart
storiesRouter.post(
  "/:storyId/hearts",
  tokenMiddleware,
  async (req, res, next) => {
    try {
      const authorId = req.author._id;
      const { storyId } = req.params;
      const authorHearted = await StoryModel.findOne({
        _id: storyId,
        hearts: authorId,
      });
      if (authorHearted) {
        const unheartedStory = await StoryModel.findByIdAndUpdate(
          storyId,
          {
            $pull: { hearts: authorId },
          },
          { new: true }
        );
        res.send({ message: "You unhearted the Story", story: unheartedStory });
      } else {
        const heartedStory = await StoryModel.findByIdAndUpdate(
          storyId,
          {
            $push: { hearts: authorId },
          },
          { new: true }
        );
        res.send({ message: "You hearted the Story", story: heartedStory });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default storiesRouter;
