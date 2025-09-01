const express = require("express");
const { authMiddle } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

//Get all the pending connection request for the loggedInUser
userRouter.get("/user/requests/received", authMiddle, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    })
      // .populate("fromUserId", ["firstName", "lastName"]);
      // OR
      .populate("fromUserId", "firstName lastName");

    if (!connectionRequests.length)
      return res.status(404).send("No pending connection request found");
    res
      .status(200)
      .json({ message: "Data fetched successfully", data: connectionRequests });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

userRouter.get("/user/connections", authMiddle, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);
    if (!connections.length)
      return res.status(404).send("No connections still..😥");
    const filteredConnectionsFields = connections.map((row) =>
      row.fromUserId._id.equals(loggedInUser._id)
        ? row.toUserId
        : row.fromUserId
    );
    res.status(200).json({
      message: "Connections found successfully",
      data: filteredConnectionsFields,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

userRouter.get("/feed", authMiddle, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 60 ? 60 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId age gender photoURL about");

    const blockedUsers = new Set();
    connectionRequests.forEach((user) => {
      blockedUsers.add(user.fromUserId.toString());
      blockedUsers.add(user.toUserId.toString());
    });
    const reqUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(blockedUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName age gender photoURL about")
      .skip(skip)
      .limit(limit);

    res.status(200).json({ data: reqUsers });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
