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
const http_errors_1 = __importDefault(require("http-errors"));
const model_1 = __importDefault(require("./model"));
const model_2 = __importDefault(require("../authors/model"));
const model_3 = __importDefault(require("../comments/model"));
const cloudinaryTools_1 = require("../../lib/cloudinaryTools");
const multer_1 = __importDefault(require("multer"));
const tokenMiddleware_1 = require("../../auth/tokenMiddleware");
const storiesRouter = express_1.default.Router();
//================== Get all stories, with queries
storiesRouter.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const title = req.query.title;
        const category = req.query.category;
        const skip = req.query.skip ? parseInt(req.query.skip) : 0;
        const limit = req.query.limit ? parseInt(req.query.limit) : 0;
        const regex = new RegExp([title].join(''), 'i');
        if (title && category) {
            const searchedTitleCategoriesStories = yield model_1.default.find({
                $and: [{ title: regex }, { categories: category }],
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('author');
            res.send(searchedTitleCategoriesStories);
        }
        else if (title) {
            const searchedTitleStories = yield model_1.default.find({
                title: regex,
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('author');
            res.send(searchedTitleStories);
        }
        else if (category) {
            const searchedCategoriesStories = yield model_1.default.find({
                categories: category,
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('author');
            res.send(searchedCategoriesStories);
        }
        else {
            const stories = yield model_1.default.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('author');
            res.send(stories);
        }
    }
    catch (error) {
        next(error);
    }
}));
//================ Post a new Story.
storiesRouter.post('/', tokenMiddleware_1.tokenMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorId = req.author._id;
        const newStory = new model_1.default(Object.assign(Object.assign({}, req.body), { author: authorId }));
        yield newStory.save();
        res
            .status(201)
            .send({ message: 'You posted a new story.', story: newStory });
    }
    catch (error) {
        next(error);
    }
}));
//==================Get all my stories.
storiesRouter.get('/me', tokenMiddleware_1.tokenMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorId = req.author._id;
        const stories = yield model_1.default.find({ author: authorId })
            .sort({
            createdAt: -1,
        })
            .populate('author');
        res.send(stories);
    }
    catch (error) {
        next(error);
    }
}));
//==================== Get all stories I hearted.
storiesRouter.get('/hearts', tokenMiddleware_1.tokenMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorId = req.author._id;
        const stories = yield model_1.default.find({ hearts: authorId })
            .sort({
            createdAt: -1,
        })
            .populate('author');
        res.send(stories);
    }
    catch (error) {
        next(error);
    }
}));
//===================Get all Stories from an Author.
storiesRouter.get('/author/:authorId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorId } = req.params;
        const author = yield model_2.default.findById(authorId);
        if (author) {
            const stories = yield model_1.default.find({ author: author._id })
                .sort({
                createdAt: -1,
            })
                .populate('author');
            res.send(stories);
        }
        else {
            next((0, http_errors_1.default)(404, `Author with the id: ${authorId} was not found.`));
        }
    }
    catch (error) {
        next(error);
    }
}));
//=======================Get one Story at random.
storiesRouter.get('/random', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        model_1.default.count().exec(function (err, count) {
            const random = Math.floor(Math.random() * count);
            model_1.default.findOne()
                .skip(random)
                .populate('author')
                .exec(function (err, result) {
                res.send(result);
            });
        });
    }
    catch (error) {
        next(error);
    }
}));
//====================Get one Story
storiesRouter.get('/:storyId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { storyId } = req.params;
        const story = yield model_1.default.findById(storyId).populate('author');
        if (story) {
            res.send(story);
        }
        else {
            next((0, http_errors_1.default)(404, `The story with the id: ${storyId} was not found.`));
        }
    }
    catch (error) {
        next(error);
    }
}));
//====================Post an image to the Story.
storiesRouter.post('/:storyId/storyImage', tokenMiddleware_1.tokenMiddleware, (0, multer_1.default)({ storage: cloudinaryTools_1.saveStoryImageCloudinary }).single('storyImage'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authorId = req.author._id;
        const { storyId } = req.params;
        const storyImage = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        const updatedStory = yield model_1.default.findOneAndUpdate({ _id: storyId, author: authorId }, {
            storyImage,
        }, { new: true });
        if (updatedStory) {
            res.send({
                message: 'You successfully posted an image to your story.',
                story: updatedStory,
            });
        }
        else {
            next((0, http_errors_1.default)(404, `Story with the id: ${storyId} was not found.`));
        }
    }
    catch (error) {
        next(error);
    }
}));
//=======================Update my Story.
storiesRouter.put('/:storyId/me', tokenMiddleware_1.tokenMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorId = req.author._id;
        const { storyId } = req.params;
        const updatedStory = yield model_1.default.findOneAndUpdate({ _id: storyId, author: authorId }, req.body, { new: true });
        if (updatedStory) {
            res.send({ message: 'Your story was updated', story: updatedStory });
        }
        else {
            next((0, http_errors_1.default)(404, `The story with id: ${storyId} was not found.`));
        }
    }
    catch (error) {
        next(error);
    }
}));
//=======================Delete my story
storiesRouter.delete('/:storyId/me', tokenMiddleware_1.tokenMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorId = req.author._id;
        const { storyId } = req.params;
        const story = yield model_1.default.findOne({
            _id: storyId,
            author: authorId,
        });
        if (story) {
            yield model_1.default.deleteOne({ _id: story._id });
            yield model_3.default.deleteMany({ author: story._id });
            res.send({
                message: 'Your story was deleted',
                story,
            });
        }
        else {
            next((0, http_errors_1.default)(404, `The story with id: ${storyId} was not found.`));
        }
    }
    catch (error) {
        next(error);
    }
}));
//=========================Post or remove a heart
storiesRouter.post('/:storyId/hearts', tokenMiddleware_1.tokenMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorId = req.author._id;
        const { storyId } = req.params;
        const authorHearted = yield model_1.default.findOne({
            _id: storyId,
            hearts: authorId,
        });
        if (authorHearted) {
            const unheartedStory = yield model_1.default.findByIdAndUpdate(storyId, {
                $pull: { hearts: authorId },
            }, { new: true });
            res.send({ message: 'You unhearted the Story', story: unheartedStory });
        }
        else {
            const heartedStory = yield model_1.default.findByIdAndUpdate(storyId, {
                $push: { hearts: authorId },
            }, { new: true });
            res.send({ message: 'You hearted the Story', story: heartedStory });
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = storiesRouter;
