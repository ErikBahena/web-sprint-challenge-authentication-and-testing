const User = require("../users/users-model");

const bcrypt = require("bcryptjs");
const { tokenBuilder } = require("./auth-helpers");
const { BCRYPT_ROUNDS } = require("../../config");

const validateUser = (req, res, next) => {
  const user = req.body;

  if (
    !user.password ||
    user.password.trim() === "" ||
    !user.username ||
    user.username.trim() === ""
  ) {
    return next({ status: 400, message: "username and password required" });
  } else next();
};

const alreadyExistsInDb = async (req, res, next) => {
  const { username } = req.body;

  const user = await User.getBy("username", username);

  if (user) return next({ status: 404, message: "username taken" });
  else next();
};

const checkUsernameExists = async (req, res, next) => {
  const { username } = req.body;

  const user = await User.getBy("username", username);

  if (!user) return next({ status: 401, message: "invalid credentials" });

  req.userFromDb = user;
  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;

  const userFromDb = req.userFromDb;

  if (bcrypt.compareSync(password, userFromDb.password)) {
    req.token = tokenBuilder(userFromDb);
    next();
  } else next({ status: 401, message: "invalid credentials" });
};

const hashPassword = (req, res, next) => {
  const user = req.body;

  const hash = bcrypt.hashSync(user.password, BCRYPT_ROUNDS);

  user.password = hash;

  req.user = user;
  next();
};

module.exports = {
  validateUser,
  alreadyExistsInDb,
  checkUsernameExists,
  validatePassword,
  hashPassword,
};
