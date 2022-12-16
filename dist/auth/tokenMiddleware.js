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
exports.tokenMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const model_1 = __importDefault(require("../services/authors/model"));
const tokenTools_1 = require("./tokenTools");
const tokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const decodedToken = yield (0, tokenTools_1.verifyJWTToken)(token);
            const author = yield model_1.default.findById(decodedToken._id);
            if (author) {
                req.author = author;
                next();
            }
            else {
                next((0, http_errors_1.default)(404, "Author not found"));
            }
        }
        else {
            next((0, http_errors_1.default)(401, "Please provide credentials"));
        }
    }
    catch (error) {
        next((0, http_errors_1.default)(401, "Token not valid"));
    }
});
exports.tokenMiddleware = tokenMiddleware;
