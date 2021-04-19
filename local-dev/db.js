const { Pool } = require("pg");

require("dotenv").config();

const pool = new Pool({
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
});
console.log(process.env);
pool.on("error", (error, client) => {
  console.error(`DB Error: ${error.message}:${error.stack}`);
});

module.exports = {
  query: (query, params) => {
    return new Promise((resolve, reject) => {
      if (!query) {
        console.error(`DB query Error: query not defined`);
        reject(`query not defined`);
      } else {
        pool
          .query(query, params)
          .then((res) => {
            resolve(res.rows);
          })
          .catch((error) => {
            console.error(`DB client query Error: ${error}`);
            reject(error);
          });
      }
    });
  },
};
