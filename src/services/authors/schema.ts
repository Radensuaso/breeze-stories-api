import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { AuthorDocument } from "../../../typings/Author";
import randomizeAvatar from "../../lib/randomizeAvatar";

const { Schema } = mongoose;

const AuthorSchema = new Schema<AuthorDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true, default: randomizeAvatar() },
    birthDate: { type: Date },
    gender: { type: String },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

// creating new
AuthorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;

  return next();
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
  const authorObject: any = this.toObject();
  delete authorObject.password;
  delete authorObject.__v;
  return authorObject;
};

//Checking credentials
AuthorSchema.statics.checkCredentials = async function (email, password) {
  const author = await this.findOne({ email });
  if (author) {
    const isMatch = await bcrypt.compare(password, author.password);
    if (isMatch) {
      return author;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export default AuthorSchema;
