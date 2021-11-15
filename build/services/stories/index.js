"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var model_1 = __importDefault(require("./model"));
var model_2 = __importDefault(require("../authors/model"));
var model_3 = __importDefault(require("../comments/model"));
var cloudinaryTools_1 = require("../../lib/cloudinaryTools");
var multer_1 = __importDefault(require("multer"));
var tokenMiddleware_1 = require("../../auth/tokenMiddleware");
var http_errors_1 = __importDefault(require("http-errors"));
var storiesRouter = express_1.default.Router();
//================== Get all stories, with queries
storiesRouter.get("/", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var title, category, skip, limit, regex, searchedTitleCategoriesStories, searchedTitleStories, searchedCategoriesStories, stories, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                title = req.query.title;
                category = req.query.category;
                skip = req.query.skip ? parseInt(req.query.skip) : 0;
                limit = req.query.limit ? parseInt(req.query.limit) : 0;
                regex = new RegExp([title].join(""), "i");
                if (!(title && category)) return [3 /*break*/, 2];
                return [4 /*yield*/, model_1.default.find({
                        $and: [{ title: regex }, { categories: category }],
                    })
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .populate("author")];
            case 1:
                searchedTitleCategoriesStories = _a.sent();
                res.send(searchedTitleCategoriesStories);
                return [3 /*break*/, 8];
            case 2:
                if (!title) return [3 /*break*/, 4];
                return [4 /*yield*/, model_1.default.find({
                        title: regex,
                    })
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .populate("author")];
            case 3:
                searchedTitleStories = _a.sent();
                res.send(searchedTitleStories);
                return [3 /*break*/, 8];
            case 4:
                if (!category) return [3 /*break*/, 6];
                return [4 /*yield*/, model_1.default.find({
                        categories: category,
                    })
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .populate("author")];
            case 5:
                searchedCategoriesStories = _a.sent();
                res.send(searchedCategoriesStories);
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, model_1.default.find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate("author")];
            case 7:
                stories = _a.sent();
                res.send(stories);
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
//================ Post a new Story.
storiesRouter.post("/", tokenMiddleware_1.tokenMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorId, newStory, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                authorId = req.author._id;
                newStory = new model_1.default(__assign(__assign({}, req.body), { author: authorId }));
                return [4 /*yield*/, newStory.save()];
            case 1:
                _a.sent();
                res
                    .status(201)
                    .send({ message: "You posted a new story.", story: newStory });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//==================Get all my stories.
storiesRouter.get("/me", tokenMiddleware_1.tokenMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorId, stories, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                authorId = req.author._id;
                return [4 /*yield*/, model_1.default.find({ author: authorId })
                        .sort({
                        createdAt: -1,
                    })
                        .populate("author")];
            case 1:
                stories = _a.sent();
                res.send(stories);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//==================== Get all stories I hearted.
storiesRouter.get("/hearts", tokenMiddleware_1.tokenMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorId, stories, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                authorId = req.author._id;
                return [4 /*yield*/, model_1.default.find({ hearts: authorId })
                        .sort({
                        createdAt: -1,
                    })
                        .populate("author")];
            case 1:
                stories = _a.sent();
                res.send(stories);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//===================Get all Stories from an Author.
storiesRouter.get("/author/:authorId", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorId, author, stories, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                authorId = req.params.authorId;
                return [4 /*yield*/, model_2.default.findById(authorId)];
            case 1:
                author = _a.sent();
                if (!author) return [3 /*break*/, 3];
                return [4 /*yield*/, model_1.default.find({ author: author._id })
                        .sort({
                        createdAt: -1,
                    })
                        .populate("author")];
            case 2:
                stories = _a.sent();
                res.send(stories);
                return [3 /*break*/, 4];
            case 3:
                next((0, http_errors_1.default)(404, "Author with the id: " + authorId + " was not found."));
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
//=======================Get one Story at random.
storiesRouter.get("/random", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            model_1.default.count().exec(function (err, count) {
                var random = Math.floor(Math.random() * count);
                model_1.default.findOne()
                    .skip(random)
                    .populate("author")
                    .exec(function (err, result) {
                    res.send(result);
                });
            });
        }
        catch (error) {
            next(error);
        }
        return [2 /*return*/];
    });
}); });
//====================Get one Story
storiesRouter.get("/:storyId", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var storyId, story, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                storyId = req.params.storyId;
                return [4 /*yield*/, model_1.default.findById(storyId).populate("author")];
            case 1:
                story = _a.sent();
                if (story) {
                    res.send(story);
                }
                else {
                    next((0, http_errors_1.default)(404, "The story with the id: " + storyId + " was not found."));
                }
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//====================Post an image to the Story.
storiesRouter.post("/:storyId/storyImage", tokenMiddleware_1.tokenMiddleware, (0, multer_1.default)({ storage: cloudinaryTools_1.saveStoryImageCloudinary }).single("storyImage"), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorId, storyId, storyImage, updatedStory, error_7;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                authorId = req.author._id;
                storyId = req.params.storyId;
                storyImage = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
                return [4 /*yield*/, model_1.default.findOneAndUpdate({ _id: storyId, author: authorId }, {
                        storyImage: storyImage,
                    }, { new: true })];
            case 1:
                updatedStory = _b.sent();
                if (updatedStory) {
                    res.send({
                        message: "You successfully posted an image to your story.",
                        story: updatedStory,
                    });
                }
                else {
                    next((0, http_errors_1.default)(404, "Story with the id: " + storyId + " was not found."));
                }
                return [3 /*break*/, 3];
            case 2:
                error_7 = _b.sent();
                next(error_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//=======================Update my Story.
storiesRouter.put("/:storyId/me", tokenMiddleware_1.tokenMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorId, storyId, updatedStory, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                authorId = req.author._id;
                storyId = req.params.storyId;
                return [4 /*yield*/, model_1.default.findOneAndUpdate({ _id: storyId, author: authorId }, req.body, { new: true })];
            case 1:
                updatedStory = _a.sent();
                if (updatedStory) {
                    res.send({ message: "Your story was updated", story: updatedStory });
                }
                else {
                    next((0, http_errors_1.default)(404, "The story with id: " + storyId + " was not found."));
                }
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                next(error_8);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//=======================Delete my story
storiesRouter.delete("/:storyId/me", tokenMiddleware_1.tokenMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorId, storyId, story, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                authorId = req.author._id;
                storyId = req.params.storyId;
                return [4 /*yield*/, model_1.default.findOne({
                        _id: storyId,
                        author: authorId,
                    })];
            case 1:
                story = _a.sent();
                if (!story) return [3 /*break*/, 4];
                return [4 /*yield*/, model_1.default.deleteOne({ _id: story._id })];
            case 2:
                _a.sent();
                return [4 /*yield*/, model_3.default.deleteMany({ author: story._id })];
            case 3:
                _a.sent();
                res.send({
                    message: "Your story was deleted",
                    story: story,
                });
                return [3 /*break*/, 5];
            case 4:
                next((0, http_errors_1.default)(404, "The story with id: " + storyId + " was not found."));
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_9 = _a.sent();
                next(error_9);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
//=========================Post or remove a heart
storiesRouter.post("/:storyId/hearts", tokenMiddleware_1.tokenMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorId, storyId, authorHearted, unheartedStory, heartedStory, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                authorId = req.author._id;
                storyId = req.params.storyId;
                return [4 /*yield*/, model_1.default.findOne({
                        _id: storyId,
                        hearts: authorId,
                    })];
            case 1:
                authorHearted = _a.sent();
                if (!authorHearted) return [3 /*break*/, 3];
                return [4 /*yield*/, model_1.default.findByIdAndUpdate(storyId, {
                        $pull: { hearts: authorId },
                    }, { new: true })];
            case 2:
                unheartedStory = _a.sent();
                res.send({ message: "You unhearted the Story", story: unheartedStory });
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, model_1.default.findByIdAndUpdate(storyId, {
                    $push: { hearts: authorId },
                }, { new: true })];
            case 4:
                heartedStory = _a.sent();
                res.send({ message: "You hearted the Story", story: heartedStory });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_10 = _a.sent();
                next(error_10);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.default = storiesRouter;
