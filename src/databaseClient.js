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
  // dbClient.query('CREATE TABLE IF NOT EXISTS VillagerStats (playerId, win integer, lose integer);');
  // dbClient.query('CREATE TABLE IF NOT EXISTS WerewolfStats (playerId, win integer, lose integer);');
  // dbClient.query('CREATE TABLE IF NOT EXISTS VampireStats (playerId, win integer, lose integer);');
  // dbClient.query('CREATE TABLE IF NOT EXISTS JesterStats (playerId, win integer, lose integer);');
  // dbClient.query('CREATE TABLE IF NOT EXISTS SerialKillerStats (playerId, win integer, lose integer);');
  // dbClient.query('CREATE TABLE IF NOT EXISTS ArsonistStats (playerId, win integer, lose integer);');
  // dbClient.query('CREATE TABLE IF NOT EXISTS SurvivorStats (playerId, win integer, lose integer);');
  // dbClient.query('CREATE TABLE IF NOT EXISTS ExecutionerStats (playerId, win integer, lose integer);');
  
  //dbClient.query(`INSERT into PlayerStats (id, name, points) VALUES ('2060', 'Siapalah', 10);`);
  
  })
  .catch(err => {
    console.log("error connect to database", err);
  });

module.exports = dbClient;