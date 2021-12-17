// do not make changes to this file
const knex = require("knex");
const knexConfig = require("../knexfile.js");
const { ENVIRONMENT } = require("../config");

module.exports = knex(knexConfig[ENVIRONMENT]);
