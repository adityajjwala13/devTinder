const mongoose = require("mongoose");

// const monogoURI =
//   "mongodb+srv://adityajhunjhunwalacse23:5x0CgHv2EXzHvDZR@tindercluster.yxovgjs.mongodb.net/devTinder";
const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};
module.exports = connectDB;
