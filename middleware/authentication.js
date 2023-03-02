const { UnauthenticatedError } = require("../errors/index");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  //   req.user = { token, name: req.body.user };
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("no token provided");
  }
  const token = authHeader.split(" ")[1];
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const { userID, name } = decode;
    req.user = { userID, name };
    // const user = User.findById(decode.id).select("password");
    // req.user = user;
    next();
  } catch {
    throw new UnauthenticatedError("authentication failed");
  }
};

module.exports = auth;
