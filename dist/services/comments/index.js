"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const model_1 = __importDefault(require("./model"));
const model_2 = __importDefault(require("../stories/model"));
const tokenMiddleware_1 = require("../../auth/tokenMiddleware");
const http_errors_1 = __importDefault(require("http-errors"));
const commentsRouter = express_1.default.Router();
//=======================Get all comments from a particular Story.
commentsRouter.get('/story/:storyId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { storyId } = req.params;
        const story = yield model_2.default.findById(storyId);
        if (story) {
            const comments = yield model_1.default.find({ story: story._id })
                .sort({ createdAt: -1 })
                .populate('author');
            res.send(comments);
        }
        else {
            next((0, http_errors_1.default)(404, `The Story with the id: ${storyId} was not found.`));
        }
    }
    catch (error) {
        next(error);
    }
}));
//=========================Post a new comment to a Story.
commentsRouter.post('/story/:storyId', tokenMiddleware_1.tokenMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorId = req.author._id;
        const { storyId } = req.params;
        const story = yield model_2.default.findById(storyId);
        if (story) {
            const newComment = new model_1.default(Object.assign(Object.assign({}, req.body), { story: storyId, author: authorId }));
            yield newComment.save();
            res
                .status(201)
                .send({ message: 'Your comment was created.', comment: newComment });
        }
        else {
            next((0, http_errors_1.default)(404, `The Story with the id: ${storyId} was not found.`));
        }
    }
    catch (error) {
        next(error);
    }
}));
//=====================Get a single comment.
commentsRouter.get('/:commentId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const comment = yield model_1.default.findById(commentId)
            .populate('author')
            .populate({ path: 'subComments.author' });
        if (comment) {
            res.send(comment);
        }
        else {
            next((0, http_errors_1.default)(404, `The comment with the id: ${commentId} was not found.`));
        }
    }
    catch (error) {
        next(error);
    }
}));
//====================Update my comment.
commentsRouter.put('/:commentId/me', tokenMiddleware_1.tokenMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorId = req.author._id;
        const { commentId } = req.params;
        const updatedComment = yield model_1.default.findOneAndUpdate({
            _id: commentId,
            author: authorId,
        }, req.body, { new: true });
        if (updatedComment) {
            res.send({
                message: 'Your comment was updated.',
                comment: updatedComment,
            });
        }
        else {
            next((0, http_errors_1.default)(404, `The comment with the id: ${commentId} was not found.`));
        }
    }
    catch (error) {
        next(error);
    }
}));
//==================Delete my comment.
commentsRouter.delete('/:commentId/me', tokenMiddleware_1.tokenMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorId = req.author._id;
        const { commentId } = req.params;
        const deletedComment = yield model_1.default.findOneAndDelete({
            _id: commentId,
            author: authorId,
        });
        if (deletedComment) {
            res.send({
                message: 'Your comment was deleted.',
                comment: deletedComment,
            });
        }
        else {
            next((0, http_errors_1.default)(404, `The comment with the id: ${commentId} was not found.`));
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = commentsRouter;
