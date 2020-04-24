// database
const { Client } = require("pg");
const dbClient = new Client({
  connectionString: process.env.DATABASE_URL
});

dbClient
  .connect()
  .then(db => {
    console.log("database connected");
  })
  .catch(err => {
    console.log("error connect to database", err);
  });

module.exports = dbClient;