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
        .populate("author")
        .populate({ path: "subComments.author" });
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

//====================Post or remove a heart to a comment
commentsRouter.post(
  "/:commentId/hearts",
  tokenMiddleware,
  async (req, res, next) => {
    try {
      const authorId = req.author._id;
      const { commentId } = req.params;
      const authorHearted = await CommentModel.findOne({
        _id: commentId,
        hearts: authorId,
      });
      if (authorHearted) {
        const unheartedComment = await CommentModel.findByIdAndUpdate(
          commentId,
          {
            $pull: { hearts: authorId },
          },
          { new: true }
        );
        res.send({
          message: "You unhearted the comment.",
          comment: unheartedComment,
        });
      } else {
        const heartedComment = await CommentModel.findByIdAndUpdate(
          commentId,
          {
            $push: { hearts: authorId },
          },
          { new: true }
        );
        res.send({
          message: "You hearted the comment.",
          comment: heartedComment,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

//=====================Post a new sub comment in a comment
commentsRouter.post(
  "/:commentId/subComments",
  tokenMiddleware,
  async (req, res, next) => {
    const authorId = req.author._id;
    const { commentId } = req.params;
    const updatedComment = await CommentModel.findByIdAndUpdate(
      commentId,
      { $push: { subComments: { ...req.body, author: authorId } } },
      { new: true }
    );
    if (updatedComment) {
      res.status(201).send({
        message: "Your sub comment was created.",
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
  }
);

//=====================Get a single Sub Comment
commentsRouter.get(
  "/:commentId/subComments/:subCommentId",
  async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const comment = await CommentModel.findById(commentId).populate({
        path: "subComments.author",
      });
      if (comment) {
        const { subCommentId } = req.params;
        const subComment = comment.subComments.find(
          (sC) => sC._id.toString() === subCommentId
        );
        if (subComment) {
          res.send(subComment);
        } else {
          next(
            createHttpError(
              404,
              `The sub comment with id: ${subCommentId} not found.`
            )
          );
        }
      } else {
        next(
          createHttpError(404, `The comment with id: ${commentId} not found.`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

//======================Update my Sub comment
commentsRouter.put(
  "/:commentId/subComments/:subCommentId/me",
  tokenMiddleware,
  async (req, res, next) => {
    try {
      const authorId = req.author._id;
      const { commentId } = req.params;
      const { subCommentId } = req.params;
      const updatedComment = await CommentModel.findOneAndUpdate(
        {
          _id: commentId,
          "subComments.author": authorId,
          "subComments._id": subCommentId,
        },
        {
          $set: {
            "subComments.$": {
              ...req.body,
              _id: subCommentId,
              author: authorId,
            },
          },
        },
        { new: true }
      );
      if (updatedComment) {
        res.send({
          message: "Your sub comment was updated.",
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

//=====================Delete my sub comment
commentsRouter.delete(
  "/:commentId/subComments/:subCommentId/me",
  tokenMiddleware,
  async (req, res, next) => {
    try {
      const authorId = req.author._id;
      const { commentId } = req.params;
      const { subCommentId } = req.params;
      const updatedComment = await CommentModel.findOneAndUpdate(
        {
          _id: commentId,
          "subComments.author": authorId,
          "subComments._id": subCommentId,
        },
        {
          $pull: {
            subComments: { _id: subCommentId },
          },
        },
        { new: true }
      );
      if (updatedComment) {
        res.send({
          message: "Your sub comment was deleted.",
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

//========================Post or remove a heart to a sub comment
commentsRouter.post(
  "/:commentId/subComments/:subCommentId/hearts",
  tokenMiddleware,
  async (req, res, next) => {
    const authorId = req.author._id;
    const { commentId } = req.params;
    const { subCommentId } = req.params;
    const authorHearted = await CommentModel.findOne({
      _id: commentId,
      "subComments.hearts": authorId,
      "subComments._id": subCommentId,
    });
    if (authorHearted) {
      const unheartedComment = await CommentModel.findOneAndUpdate(
        {
          _id: commentId,
          "subComments.hearts": authorId,
          "subComments._id": subCommentId,
        },
        {
          $pull: { "subComments.$.hearts": authorId },
        },
        { new: true }
      );
      res.send({
        message: "You unhearted the sub comment.",
        comment: unheartedComment,
      });
    } else {
      const heartedComment = await CommentModel.findOneAndUpdate(
        {
          _id: commentId,
          "subComments._id": subCommentId,
        },
        {
          $push: { "subComments.$.hearts": authorId },
        },
        { new: true }
      );
      res.send({
        message: "You hearted the sub comment.",
        comment: heartedComment,
      });
    }
  }
);

export default commentsRouter;
