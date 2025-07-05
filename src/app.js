const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const app = express();
const connectDB = require("./config/database");
const user = require("./models/user");
const cookieParser = require("cookie-parser");
const { validateSignUpData } = require("./utils/validation");
const { authMiddle } = require("./middlewares/auth");

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
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    // const userObj = {
    //   firstName: "Ram",
    //   lastName: "Agarwal",
    //   age: 27,
    //   email: "ram@gmail.com",
    //   password: "33234453",
    // };

    //Validation of req body initially
    validateSignUpData(req);
    //if validation passes successfully then password is encrypted
    const { firstName, lastName, emailId, password } = req.body;
    const passwordEncrypted = await bcrypt.hash(password, 10);

    // Now creating new instance of model user
    const User = new user({
      ...req.body,
      password: passwordEncrypted,
    });
    await User.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) throw new Error("Invalid Email!!!");
    const isUserPresent = await user.findOne({ emailId });
    // console.log(isUserPresent);
    if (!isUserPresent) throw new Error("Invalid credentials");
    const passwordCheck = await bcrypt.compare(
      password,
      isUserPresent.password
    );
    if (!passwordCheck) throw new Error("Invalid credentials");
    //Creating JSON web token(JWT)
    const jwtToken = jwt.sign({ _id: isUserPresent._id }, "aDish@123", {
      expiresIn: "5d",
    }); //Second parameter is SECRETKEY.. & first one is hidden userId

    //Now inserting the created token into cookie
    res.cookie("token", jwtToken, {
      expires: new Date(Date.now() + 6 * 3600000),
    });
    res.status(200).send("User logged in successfully🤗");
  } catch (error) {
    res.status(400).send("Error : " + error);
  }
});

app.get("/profile", authMiddle, async (req, res) => {
  try {
    const findUser = req.user;
    res.status(200).json(findUser);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

app.post("/sendConnectionRequest", authMiddle, async (req, res) => {
  try {
    const { firstName } = req.user;
    res
      .status(200)
      .send(`Connection request sent successfully by ${firstName}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

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
