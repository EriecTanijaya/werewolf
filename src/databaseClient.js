// database
const { Client } = require("pg");
const dbClient = new Client({
  connectionString: process.env.DATABASE_URL
});

dbClient
  .connect()
  .then(db => {
    console.log("database connected");
  
  dbClient.query(`CREATE TABLE IF NOT EXISTS PlayerStats (id text, name text, points int);`);
  dbClient.query(`CREATE TABLE IF NOT EXISTS VillagerStats (playerId, win int, lose int);`);
  dbClient.query(`CREATE TABLE IF NOT EXISTS WerewolfStats (playerId, win int, lose int);`);
  dbClient.query(`CREATE TABLE IF NOT EXISTS VampireStats (playerId, win int, lose int);`);
  dbClient.query(`CREATE TABLE IF NOT EXISTS JesterStats (playerId, win int, lose int);`);
  dbClient.query(`CREATE TABLE IF NOT EXISTS SerialKillerStats (playerId, win int, lose int);`);
  dbClient.query(`CREATE TABLE IF NOT EXISTS ArsonistStats (playerId, win int, lose int);`);
  dbClient.query(`CREATE TABLE IF NOT EXISTS SurvivorStats (playerId, win int, lose int);`);
  dbClient.query(`CREATE TABLE IF NOT EXISTS ExecutionerStats (playerId, win int, lose int);`);
  
  })
  .catch(err => {
    console.log("error connect to database", err);
  });

module.exports = dbClient;