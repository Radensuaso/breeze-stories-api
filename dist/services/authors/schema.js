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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const randomizeAvatar_1 = __importDefault(require("../../lib/randomizeAvatar"));
const { Schema } = mongoose_1.default;
const AuthorSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true, default: (0, randomizeAvatar_1.default)() },
    birthDate: { type: Date },
    gender: { type: String },
    bio: { type: String },
}, {
    timestamps: true,
});
// creating new
AuthorSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        const hash = yield bcrypt_1.default.hash(this.password, 12);
        this.password = hash;
        return next();
    });
});
// // Updating existent
// AuthorSchema.pre("findOneAndUpdate", async function (this) {
//   const update: any = this.getUpdate()!;
//   const { password: plainPwd } = update;
//   if (plainPwd) {
//     const password = await bcrypt.hash(plainPwd, 10);
//     this.setUpdate({ ...update, password });
//   }
// });
//Showing json without passwords
AuthorSchema.methods.toJSON = function () {
    const authorObject = this.toObject();
    delete authorObject.password;
    delete authorObject.__v;
    return authorObject;
};
//Checking credentials
AuthorSchema.statics.checkCredentials = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const author = yield this.findOne({ email });
        if (author) {
            const isMatch = yield bcrypt_1.default.compare(password, author.password);
            if (isMatch) {
                return author;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    });
};
exports.default = AuthorSchema;
