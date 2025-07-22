import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      require: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    avatar: {
      type: String,
      require: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// password bcrypt process
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10);
    next();
})

// password compare for correct hash
userSchema.methods.isPasswordCorrect = async function(password){
    return bcrypt.compare(password, this.password);
}




export const User = mongoose.model("User", userSchema);
