const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://adityajhunjhunwalacse23:OMshrishyam4888@tindercluster.yxovgjs.mongodb.net/devTinder",
  );
};
module.exports = connectDB;
