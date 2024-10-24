const knex = require("knex");
require("dotenv").config();
const db = knex({
  client: "pg", // Specify the PostgreSQL client
  connection: {
    host: "localhost",
    user: "postgres",
    database: "lmp",
    password: "nam.sp1207",
    port: 4000,
    charset: "utf8",
  },
});

module.exports = {
  db,
};
