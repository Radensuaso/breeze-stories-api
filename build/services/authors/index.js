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
var cloudinaryTools_1 = require("../../lib/cloudinaryTools");
var multer_1 = __importDefault(require("multer"));
var tokenMiddleware_1 = require("../../auth/tokenMiddleware");
var http_errors_1 = __importDefault(require("http-errors"));
var tokenTools_1 = require("../../auth/tokenTools");
var model_2 = __importDefault(require("../stories/model"));
var model_3 = __importDefault(require("../comments/model"));
var authorsRouter = express_1.default.Router();
//==================  Get all Authors with queries
authorsRouter.get("/", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var name_1, regex, searchedAuthors, authors, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                name_1 = req.query.name;
                if (!name_1) return [3 /*break*/, 2];
                regex = new RegExp(["^", name_1].join(""), "i");
                return [4 /*yield*/, model_1.default.find({
                        name: regex,
                    }).sort({
                        name: 1,
                    })];
            case 1:
                searchedAuthors = _a.sent();
                res.send(searchedAuthors);
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, model_1.default.find().sort({
                    name: 1,
                })];
            case 3:
                authors = _a.sent();
                res.send(authors);
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
//===================  Register new author
authorsRouter.post("/register", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, author, newAuthor, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                email = req.body.email;
                return [4 /*yield*/, model_1.default.findOne({ email: email })];
            case 1:
                author = _a.sent();
                if (!!author) return [3 /*break*/, 3];
                newAuthor = new model_1.default(req.body);
                return [4 /*yield*/, newAuthor.save()];
            case 2:
                _a.sent();
                res.status(201).send({
                    message: "You successfully created a profile.",
                    author: newAuthor,
                });
                return [3 /*break*/, 4];
            case 3:
                next((0, http_errors_1.default)(409, "Email already in use."));
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
//======================= Login author
authorsRouter.post("/login", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, author, accessToken, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, model_1.default.checkCredentials(email, password)];
            case 1:
                author = _b.sent();
                if (!author) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, tokenTools_1.generateJWTToken)(author)];
            case 2:
                accessToken = _b.sent();
                res.send({ accessToken: accessToken });
                return [3 /*break*/, 4];
            case 3:
                next((0, http_errors_1.default)(401, "Credentials not correct."));
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_3 = _b.sent();
                next(error_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
//==================== Post an avatar to an author.
authorsRouter.post("/avatar", tokenMiddleware_1.tokenMiddleware, (0, multer_1.default)({ storage: cloudinaryTools_1.saveAvatarCloudinary }).single("avatar"), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorId, avatar, updatedAuthor, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                authorId = req.author._id;
                avatar = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
                return [4 /*yield*/, model_1.default.findByIdAndUpdate(authorId, {
                        avatar: avatar,
                    }, { new: true })];
            case 1:
                updatedAuthor = _b.sent();
                res.send({
                    message: "You successfully posted an avatar to your profile.",
                    author: updatedAuthor,
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//==================  Get my profile.
authorsRouter.get("/me", tokenMiddleware_1.tokenMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorId, author, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                authorId = req.author._id;
                return [4 /*yield*/, model_1.default.findById(authorId)];
            case 1:
                author = _a.sent();
                res.send(author);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//=================== Update my profile
authorsRouter.put("/me", tokenMiddleware_1.tokenMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorId, me, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                authorId = req.author._id;
                return [4 /*yield*/, model_1.default.findByIdAndUpdate(authorId, req.body, {
                        new: true,
                    })];
            case 1:
                me = _a.sent();
                res.send({ message: "You updated your profile.", me: me });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//=================== Delete my profile.
authorsRouter.delete("/me", tokenMiddleware_1.tokenMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorId, author, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                authorId = req.author._id;
                return [4 /*yield*/, model_1.default.findById(authorId)];
            case 1:
                author = _a.sent();
                if (!author) return [3 /*break*/, 5];
                return [4 /*yield*/, model_1.default.deleteOne({ _id: author._id })];
            case 2:
                _a.sent();
                return [4 /*yield*/, model_2.default.deleteMany({ author: author._id })];
            case 3:
                _a.sent();
                return [4 /*yield*/, model_3.default.deleteMany({ author: author._id })];
            case 4:
                _a.sent();
                res.send({ message: "You deleted your profile.", author: author });
                return [3 /*break*/, 6];
            case 5:
                next((0, http_errors_1.default)(404, "Author does not exist."));
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_7 = _a.sent();
                next(error_7);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
//==================== Get the profile of a single author.
authorsRouter.get("/:authorId", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorId, author, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                authorId = req.params.authorId;
                return [4 /*yield*/, model_1.default.findById(authorId)];
            case 1:
                author = _a.sent();
                if (author) {
                    res.send(author);
                }
                else {
                    next((0, http_errors_1.default)(404, "Author not Found."));
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
exports.default = authorsRouter;
