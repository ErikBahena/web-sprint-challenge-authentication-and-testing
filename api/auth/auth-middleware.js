const req = require("express/lib/request");
const User = require("../users/users-model");

const validateUser = (req, res, next) => {
  const user = req.body;

  if (
    !user.password ||
    user.password.trim() === "" ||
    !user.username ||
    user.username.trim() === ""
  ) {
    next({ status: 400, message: "username and password required" });
  } else next();
};

const existsInDb = async (req, res, next) => {
  const { username } = req.body;

  const user = await User.getBy({ username });

  if (user) next({ status: 404, message: "username taken" });
  else next();
};

module.exports = { validateUser, existsInDb };
