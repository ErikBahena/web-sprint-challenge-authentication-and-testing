const User = require("../users/users-model");

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

const existsInDb = async (req, res, next) => {
  const { username } = req.body;

  const user = await User.getBy("username", username);

  if (!user) next();

  if (user) return next({ status: 404, message: "username taken" });
};

module.exports = { validateUser, existsInDb };
