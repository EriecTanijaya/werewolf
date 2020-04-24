// database
const { Client } = require("pg");
const dbClient = new Client({
  connectionString: process.env.DATABASE_URL
});

dbClient
  .connect()
  .then(db => {
    console.log("database connected");
  
  dbClient.query('CREATE TABLE IF NOT EXISTS PlayerStats (id varchar primary key, name text, points integer);');
  dbClient.query('CREATE TABLE IF NOT EXISTS VillagerStats (playerId varchar primary key, win integer, lose integer);');
  dbClient.query('CREATE TABLE IF NOT EXISTS WerewolfStats (playerId varchar primary key, win integer, lose integer);');
  dbClient.query('CREATE TABLE IF NOT EXISTS VampireStats (playerId varchar primary key, win integer, lose integer);');
  dbClient.query('CREATE TABLE IF NOT EXISTS JesterStats (playerId varchar primary key, win integer, lose integer);');
  dbClient.query('CREATE TABLE IF NOT EXISTS SerialKillerStats (playerId varchar primary key, win integer, lose integer);');
  dbClient.query('CREATE TABLE IF NOT EXISTS ArsonistStats (playerId varchar primary key, win integer, lose integer);');
  dbClient.query('CREATE TABLE IF NOT EXISTS SurvivorStats (playerId varchar primary key, win integer, lose integer);');
  dbClient.query('CREATE TABLE IF NOT EXISTS ExecutionerStats (playerId varchar primary key, win integer, lose integer);');
  
  // dbClient.query(`SELECT * FROM VillagerStats;`).then((res) => {
  //   console.log(res.rows);
  // });
  // dbClient.query(`DROP TABLE IF EXISTS WerewolfStats;`);
  })
  .catch(err => {
    console.log("error connect to database", err);
  });

module.exports = dbClient;