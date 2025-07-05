const mongoose = require("mongoose");

// const monogoURI =
//   "mongodb+srv://adityajhunjhunwalacse23:5x0CgHv2EXzHvDZR@tindercluster.yxovgjs.mongodb.net/devTinder";
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://adityajhunjhunwalacse23:5x0CgHv2EXzHvDZR@tindercluster.yxovgjs.mongodb.net/devTinder"
  );
};
module.exports = connectDB;
