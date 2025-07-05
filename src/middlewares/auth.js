const jwt = require("jsonwebtoken");
const user = require("../models/user");
const authMiddle = async (req, res, next) => {
  try {
    //Token validation
    const { token } = req.cookies;
    if (!token) throw new Error("Invalid token🙂");
    const verifyJWT = jwt.verify(token, "aDish@123");
    const { _id } = verifyJWT;
    const findUser = await user.findById(_id);
    if (!findUser) throw new Error("User not found!!");
    req.user = findUser;
    next();
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
};
module.exports = { authMiddle };
