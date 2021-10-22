import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { AuthorDocument } from "../../typings/Author";

const { Schema } = mongoose;

const AuthorSchema = new Schema<AuthorDocument>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Author"],
      default: "Author",
    },
    avatar: { type: String },
    birthDate: { type: Date },
    refreshToken: { type: String },
    googleId: { type: String },
  },
  {
    timestamps: true,
  }
);

//  ======== Hashing passwords
// creating new
AuthorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;

  return next();
});

// Updating existent
AuthorSchema.pre("findOneAndUpdate", async function (this) {
  const update: any = this.getUpdate()!;
  const { password: plainPwd } = update;

  if (plainPwd) {
    const password = await bcrypt.hash(plainPwd, 10);
    this.setUpdate({ ...update, password });
  }
});

//Showing json without passwords
AuthorSchema.methods.toJSON = function () {
  const userObject: any = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

//Checking credentials
AuthorSchema.statics.checkCredentials = async function (username, password) {
  const author = await this.findOne({ username });
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