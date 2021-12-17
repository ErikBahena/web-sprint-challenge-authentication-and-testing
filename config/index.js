module.exports = {
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 8,
  JWT_SECRET: process.env.JWT_SECRET || "shh",
  ENVIRONMENT: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3300,
};
