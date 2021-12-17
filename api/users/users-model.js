const db = require("../../data/dbConfig");

const getById = async (id) => {
  return await db("users").where("id", id).first();
};

const getBy = async (arg1, arg2) => {
  return await db("users").where(arg1, arg2).first();
};

const add = async (newUser) => {
  const [newUserId] = await db("users").insert(newUser);

  return getById(newUserId);
};

module.exports = { getById, add, getBy };
