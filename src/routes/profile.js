const express = require("express");
const profileRouter = express.Router();
const { authMiddle } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateEditPassword,
} = require("../utils/validation");
const user = require("../models/user");
const bcrypt = require("bcrypt");

profileRouter.get("/view", authMiddle, async (req, res) => {
  try {
    const loggedInUser = req.user;
    res.status(200).json(loggedInUser);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

profileRouter.patch("/edit", authMiddle, async (req, res) => {
  try {
    validateEditProfileData(req);
    const loggedInUser = req.user;

    // await user.findByIdAndUpdate(loggedInUser._id, req.body, {
    //   runValidators: true,
    // });
    // res
    //   .status(200)
    //   .send(
    //     `${
    //       req.body.firstName || loggedInUser.firstName
    //     }, your profile has been updated successfully`
    //   );

    //Another way for above commented code......
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.status(200).json({
      message: `${loggedInUser.firstName}, your profile has been updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

profileRouter.patch("/editPassword", authMiddle, async (req, res) => {
  try {
    await validateEditPassword(req);
    const { newPassword } = req.body;
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await user.findByIdAndUpdate(
      req.user._id,
      { password: passwordHash },
      { runValidators: true }
    );
    res.status(200).json({ message: "Password updated successfully ☺️" });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = profileRouter;
