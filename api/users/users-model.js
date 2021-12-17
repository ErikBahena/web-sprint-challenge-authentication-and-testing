const db = require("../../data/dbConfig");

const getById = async (id) => {
  return await db("users").where("id", id).first();
};

const getBy = async (filter) => {
  return await db("users").where(filter).first();
};

const add = async (newUser) => {
  const [newUserId] = db("users").insert(newUser);

  return getById(newUserId);
};

module.exports = { getById, add, getBy };
