const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const validator = require("validator");
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
      required: true,
      validate(email) {
        if (!validator.isEmail(email)) {
          throw new error("Invalid Email");
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

const User = model("User", userSchema);
module.exports = User;
