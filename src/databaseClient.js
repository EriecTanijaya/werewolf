// database
const { Client } = require("pg");
const dbClient = new Client({
  connectionString: process.env.DATABASE_URL
});

dbClient
  .connect()
  .then(db => {
    console.log("database connected");
  
  dbClient.query('CREATE TABLE IF NOT EXISTS PlayerStats (id text, name text, points integer);');
  dbClient.query('CREATE TABLE IF NOT EXISTS VillagerStats (playerId text, win integer, lose integer);');
  dbClient.query('CREATE TABLE IF NOT EXISTS WerewolfStats (playerId text, win integer, lose integer);');
  dbClient.query('CREATE TABLE IF NOT EXISTS VampireStats (playerId text, win integer, lose integer);');
  dbClient.query('CREATE TABLE IF NOT EXISTS JesterStats (playerId text, win integer, lose integer);');
  dbClient.query('CREATE TABLE IF NOT EXISTS SerialKillerStats (playerId text, win integer, lose integer);');
  dbClient.query('CREATE TABLE IF NOT EXISTS ArsonistStats (playerId text, win integer, lose integer);');
  dbClient.query('CREATE TABLE IF NOT EXISTS SurvivorStats (playerId text, win integer, lose integer);');
  dbClient.query('CREATE TABLE IF NOT EXISTS ExecutionerStats (playerId text, win integer, lose integer);');
  
  //dbClient.query(`INSERT into PlayerStats (id, name, points) VALUES ('4401', 'Ini siapa lagi', 5);`);
  
  })
  .catch(err => {
    console.log("error connect to database", err);
  });

module.exports = dbClient;