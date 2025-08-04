const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    age: {
      type: Number,
    },
    emailId: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
      validate(email) {
        if (!validator.isEmail(email)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      //   enum: ["male", "female", "others"],
      validate(val) {
        if (!["male", "female", "others"].includes(val))
          throw new Error("Gender validation failed");
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  //Never use arrow func here
  const user = this;
  const passwordHash = user.password;
  const isPasswordCorrect = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordCorrect;
};

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "aDish@123", {
    expiresIn: "5d",
  }); //Second parameter is SECRETKEY.. & first one is hidden userId
  return token;
};

const User = model("User", userSchema);
module.exports = User;
