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
const cloudinaryTools_1 = require("../../lib/cloudinaryTools");
const multer_1 = __importDefault(require("multer"));
const tokenMiddleware_1 = require("../../auth/tokenMiddleware");
const http_errors_1 = __importDefault(require("http-errors"));
const tokenTools_1 = require("../../auth/tokenTools");
const model_2 = __importDefault(require("../stories/model"));
const model_3 = __importDefault(require("../comments/model"));
const authorsRouter = express_1.default.Router();
//==================  Get all Authors with queries
authorsRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.query;
        if (name) {
            const regex = new RegExp(["^", name].join(""), "i");
            const searchedAuthors = yield model_1.default.find({
                name: regex,
            }).sort({
                name: 1,
            });
            res.send(searchedAuthors);
        }
        else {
            const authors = yield model_1.default.find().sort({
                name: 1,
            });
            res.send(authors);
        }
    }
    catch (error) {
        next(error);
    }
}));
//===================  Register new author
authorsRouter.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const author = yield model_1.default.findOne({ email });
        if (!author) {
            const newAuthor = new model_1.default(req.body);
            yield newAuthor.save();
            res.status(201).send({
                message: "You successfully created a profile.",
                author: newAuthor,
            });
        }
        else {
            next((0, http_errors_1.default)(409, "Email already in use."));
        }
    }
    catch (error) {
        next(error);
    }
}));
//======================= Login author
authorsRouter.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const author = yield model_1.default.checkCredentials(email, password);
        if (author) {
            const accessToken = yield (0, tokenTools_1.generateJWTToken)(author);
            res.send({ accessToken });
        }
        else {
            next((0, http_errors_1.default)(401, "Credentials not correct."));
        }
    }
    catch (error) {
        next(error);
    }
}));
//==================== Post an avatar to an author.
authorsRouter.post("/avatar", tokenMiddleware_1.tokenMiddleware, (0, multer_1.default)({ storage: cloudinaryTools_1.saveAvatarCloudinary }).single("avatar"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authorId = req.author._id;
        const avatar = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        const updatedAuthor = yield model_1.default.findByIdAndUpdate(authorId, {
            avatar,
        }, { new: true });
        res.send({
            message: "You successfully posted an avatar to your profile.",
            author: updatedAuthor,
        });
    }
    catch (error) {
        next(error);
    }
}));
//==================  Get my profile.
authorsRouter.get("/me", tokenMiddleware_1.tokenMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorId = req.author._id;
        const author = yield model_1.default.findById(authorId);
        res.send(author);
    }
    catch (error) {
        next(error);
    }
}));
//=================== Update my profile
authorsRouter.put("/me", tokenMiddleware_1.tokenMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorId = req.author._id;
        const me = yield model_1.default.findByIdAndUpdate(authorId, req.body, {
            new: true,
        });
        res.send({ message: "You updated your profile.", me });
    }
    catch (error) {
        next(error);
    }
}));
//=================== Delete my profile.
authorsRouter.delete("/me", tokenMiddleware_1.tokenMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorId = req.author._id;
        const author = yield model_1.default.findById(authorId);
        if (author) {
            yield model_1.default.deleteOne({ _id: author._id });
            yield model_2.default.deleteMany({ author: author._id });
            yield model_3.default.deleteMany({ author: author._id });
            res.send({ message: "You deleted your profile.", author });
        }
        else {
            next((0, http_errors_1.default)(404, "Author does not exist."));
        }
    }
    catch (error) {
        next(error);
    }
}));
//==================== Get the profile of a single author.
authorsRouter.get("/:authorId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorId } = req.params;
        const author = yield model_1.default.findById(authorId);
        if (author) {
            res.send(author);
        }
        else {
            next((0, http_errors_1.default)(404, "Author not Found."));
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = authorsRouter;
