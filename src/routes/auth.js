const express = require("express");
const validator = require("validator");
const user = require("../models/user");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
authRouter.post("/signup", async (req, res) => {
  try {
    //Validation of req body initially
    validateSignUpData(req);

    //fter validation is passed then "already existing account" check is done
    const doUserExist = await user.findOne({ emailId: req.body.emailId });
    if (doUserExist)
      res.status(409).send("User already registered. Please log in instead!!");

    //if all validation passes successfully then password is encrypted
    const { password } = req.body;
    const passwordEncrypted = await bcrypt.hash(password, 10);

    // Now creating new instance of model user
    const User = new user({
      ...req.body,
      password: passwordEncrypted,
    });
    const savedUser = await User.save();
    const jwtToken = savedUser.getJWT(); //Using Schema methods

    res.cookie("token", jwtToken, {
      expires: new Date(Date.now() + 6 * 3600000),
    });
    res
      .status(200)
      .json({ message: "User registered successfully", data: savedUser });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) throw new Error("Invalid Email!!!");
    const UserPresent = await user.findOne({ emailId });
    // console.log(isUserPresent);
    if (!UserPresent) throw new Error("Invalid credentials");
    // const passwordCheck = await bcrypt.compare(password, UserPresent.password);
    const isPasswordCorrect = await UserPresent.validatePassword(password);

    if (!isPasswordCorrect) throw new Error("Invalid credentials");

    //Creating JSON web token(JWT)

    // const jwtToken = jwt.sign({ _id: isUserPresent._id }, "aDish@123", {
    //   expiresIn: "5d",
    // }); //Second parameter is SECRETKEY.. & first one is hidden userId

    //The above one is perfectly fine but for more industry specific the below format is as follows:-
    const jwtToken = UserPresent.getJWT(); //Using Schema methods

    //Now inserting the created token into cookie
    res.cookie("token", jwtToken, {
      expires: new Date(Date.now() + 6 * 3600000),
    });
    res
      .status(200)
      .json({ message: "User loggedIn successfully", data: UserPresent });
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logged out successfully!!");
});
module.exports = authRouter;
