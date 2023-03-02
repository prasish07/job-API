const User = require("../models/User");
const jwt = require("jsonwebtoken");

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { name } = req.body;
  const user = await User.create({ ...req.body });
  res
    .status(StatusCodes.CREATED)
    .json({ user: { user }, token: user.createJWT() });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("invalid credentials");
  }
  //compare password
  const isPassword = await user.comparePassword(password);
  if (!isPassword) {
    throw new UnauthenticatedError("invalid credentials");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
