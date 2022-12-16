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
exports.verifyJWTToken = exports.generateJWTToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
if (!process.env.JWT_SECRET) {
    throw new Error('No JWT Secret');
}
const JWTSecret = process.env.JWT_SECRET;
//============== Generate JWT Token
const generateJWT = (author) => new Promise((resolve, reject) => jsonwebtoken_1.default.sign({ _id: author._id }, JWTSecret, { expiresIn: '7 days' }, (err, token) => {
    if (err) {
        reject(err);
    }
    else {
        resolve(token);
    }
}));
const generateJWTToken = (author) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield generateJWT(author);
    return accessToken;
});
exports.generateJWTToken = generateJWTToken;
//=================== Verify JWT Token
const verifyJWTToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => jsonwebtoken_1.default.verify(token, JWTSecret, (err, decodedToken) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(decodedToken);
        }
    }));
});
exports.verifyJWTToken = verifyJWTToken;
