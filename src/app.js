const express = require("express");
// const jwt = require("jsonwebtoken");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// // app.use("/test", (req, res) => res.send("We r here for testing"));
// // app.use("/hello", (req, res) => res.send("Hello Dude"));
// app.use("/admin", authMiddle);
// app.get("/admin", (req, res, next) => {
//   res.send("Hiiiiii");
// });

// app.get(
//   "/user",
//   (req, res, next) => {
//     console.log("first");
//     // res.send("JEIi");
//     next();
//   },
//   (req, res, next) => {
//     res.send("Second");
//   }
// );

// middlewares
app.use(
  cors({
    // origin: "http://localhost:5174",
    origin: "http://51.20.7.213/",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// // Get user by email
// app.get("/user", async (req, res) => {
//   try {
//     const reqEmail = req.body.emailId;
//     const users = await user.find({ emailId: reqEmail });
//     if (users.length) res.send(users);
//     else res.status(404).send("User not found");
//   } catch (error) {
//     res.status(400).send("Something went wrong");
//   }
// });

// //Feed API - GET /feed - get all the users from the database
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await user.find();
//     res.status(200).send(users);
//   } catch (error) {
//     res.status(400).send("Something went wrong");
//   }
// });

// //Delete user from db
// app.delete("/user", async (req, res) => {
//   try {
//     const userId = req.body.userID;
//     await user.findByIdAndDelete(userId);
//     res.status(200).send("User deleted successfully");
//   } catch (error) {
//     res.status(400).send("Something went wrong");
//   }
// });

// //Update user in db
// app.patch("/user/:userId", async (req, res) => {
//   try {
//     // const userId = req.body.userID;
//     // const email = req.body.emailId;
//     const data = req.body;
//     const userId = req.params?.userId;
//     const allowed_updates = ["age", "password", "firstName", "lastName"];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       allowed_updates.includes(k)
//     );
//     if (!isUpdateAllowed) res.status(400).send("Update not allowed");
//     await user.findByIdAndUpdate(userId, data, {
//       runValidators: true,
//     });
//     // await user.findOneAndUpdate({ emailId: email }, data, {
//     //   runValidators: true,
//     // });
//     res.status(200).send("User updated successfully");
//   } catch (error) {
//     res.status(400).send("Update failed: " + error.message);
//   }
// });

connectDB()
  .then(() => {
    console.log("Database connection established....");
    app.listen(7777, () =>
      console.log("Server started listening on port 7777....")
    );
  })
  .catch((err) => console.log("Database cannot be connected!!🥲"));
