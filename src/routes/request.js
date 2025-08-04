const express = require("express");
const requestRouter = express.Router();
const { authMiddle } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  authMiddle,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      if (fromUserId.equals(toUserId))
        return res.status(400).send("Cannot send request to yourself!!"); // Also instead of this u can also write a middleware named pre that I have used in model/connectionRequest before save like preSave
      const allowedStatus = ["ignored", "interested"]; //Validation for status
      if (!allowedStatus.includes(status))
        return res
          .status(400)
          .json({ message: "Invalid status type " + status });

      //Validation for toUserId
      const isReceiverExists = await user.findById(toUserId);
      if (!isReceiverExists)
        return res.status(404).json({ message: "User not found!!" });
      const existingConnectionRequest = await ConnectionRequest.findOne({
        //Validation to check whether already connection request is sent to receiver or vice versa
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest)
        return res.status(400).send("Connection Request Already Exists");
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const mssg =
        status === "interested"
          ? `${req.user.firstName} is interested in ${isReceiverExists.firstName}`
          : `${req.user.firstName} ignored ${isReceiverExists.firstName}`;
      const data = await connectionRequest.save();
      res.status(200).json({ message: mssg, data });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  authMiddle,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status))
        return res.status(400).json({ mesage: "Status not allowed" });
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest)
        return res
          .status(404)
          .json({ message: "Connection Request not found" });
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res
        .status(200)
        .json({ message: `Connection Request ${status} successfully`, data });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);
module.exports = requestRouter;
