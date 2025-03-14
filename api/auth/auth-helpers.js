const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");

function tokenBuilder(user) {
  const payload = {
    id: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = {
  tokenBuilder,
};
