import express from "express";
import CommentModel from "./model";
import StoryModel from "../stories/model";
import { tokenMiddleware } from "../../auth/tokenMiddleware";
import createHttpError from "http-errors";
import { CommentDocument } from "typings/Comment";

const commentsRouter = express.Router();

//=======================Get all comments from a particular Story.
commentsRouter.get("/story/:storyId", async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const story = await StoryModel.findById(storyId);
    if (story) {
      const comments = await CommentModel.find({ story: story._id })
        .sort({ createdAt: -1 })
        .populate("author");
      res.send(comments);
    } else {
      next(
        createHttpError(404, `The Story with the id: ${storyId} was not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

//=========================Post a new comment to a Story.
commentsRouter.post(
  "/story/:storyId",
  tokenMiddleware,
  async (req, res, next) => {
    try {
      const authorId = req.author._id;
      const { storyId } = req.params;
      const story = await StoryModel.findById(storyId);
      if (story) {
        const newComment = new CommentModel({
          ...req.body,
          story: storyId,
          author: authorId,
        });
        await newComment.save();
        res
          .status(201)
          .send({ message: "Your comment was created.", comment: newComment });
      } else {
        next(
          createHttpError(
            404,
            `The Story with the id: ${storyId} was not found.`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

//=====================Get a single comment.
commentsRouter.get("/:commentId", async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await CommentModel.findById(commentId)
      .populate("author")
      .populate({ path: "subComments.author" });
    if (comment) {
      res.send(comment);
    } else {
      next(
        createHttpError(
          404,
          `The comment with the id: ${commentId} was not found.`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

//====================Update my comment.
commentsRouter.put(
  "/:commentId/me",
  tokenMiddleware,
  async (req, res, next) => {
    try {
      const authorId = req.author._id;
      const { commentId } = req.params;
      const updatedComment = await CommentModel.findOneAndUpdate(
        {
          _id: commentId,
          author: authorId,
        },
        req.body,
        { new: true }
      );
      if (updatedComment) {
        res.send({
          message: "Your comment was updated.",
          comment: updatedComment,
        });
      } else {
        next(
          createHttpError(
            404,
            `The comment with the id: ${commentId} was not found.`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

//==================Delete my comment.
commentsRouter.delete(
  "/:commentId/me",
  tokenMiddleware,
  async (req, res, next) => {
    try {
      const authorId = req.author._id;
      const { commentId } = req.params;
      const deletedComment = await CommentModel.findOneAndDelete({
        _id: commentId,
        author: authorId,
      });
      if (deletedComment) {
        res.send({
          message: "Your comment was deleted.",
          comment: deletedComment,
        });
      } else {
        next(
          createHttpError(
            404,
            `The comment with the id: ${commentId} was not found.`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default commentsRouter;
