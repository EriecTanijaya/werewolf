const baseUserPath = "/app/.data/users/";
const fs = require("fs");
const dbClient = require("/app/src/databaseClient");

function getAllUserData(team, cb) {
  const users = [];
  let pending = 0;
  
  
  
  dbClient.query()
    .then(db => {
    
  })
  
  fs.readdir(baseUserPath, (err, list) => {
    if (err) throw err;
    pending = list.length;
    list.forEach((item, index) => {
      if (item.includes("user")) {
        fs.readFile(baseUserPath + item, (err, data) => {
          let rawUser = JSON.parse(data);

          let stats = {
            villager: rawUser.villagerStats,
            werewolf: rawUser.werewolfStats,
            vampire: rawUser.vampireStats,
            jester: rawUser.jesterStats,
            serialKiller: rawUser.serialKillerStats,
            arsonist: rawUser.arsonistStats,
            survivor: rawUser.survivorStats,
            executioner: rawUser.executionerStats
          };

          let result = calculateWinLose(team, stats);
          let totalGame = result.win + result.lose;
          let winRate = Math.floor((result.win / totalGame) * 100);
          if (isNaN(winRate)) {
            winRate = 0;
          }

          let user = {
            id: rawUser.id,
            name: rawUser.name,
            points: rawUser.points,
            totalGame: totalGame,
            winRate: winRate + "%"
          };

          if (team) {
            let points = result.win * 5 + result.lose;
            user.points = points;
          }

          users.push(user);
          if (pending === index + 1) {
            cb(users);
          }
        });
      }
    });
  });
}

function calculateWinLose(team, stats) {
  let win = 0;
  let lose = 0;
  switch (team) {
    case "villager":
      win = stats.villager.win;
      lose = stats.villager.lose;
      break;

    case "werewolf":
      win = stats.werewolf.win;
      lose = stats.werewolf.lose;
      break;

    case "jester":
      win = stats.jester.win;
      lose = stats.jester.lose;
      break;

    case "vampire":
      win = stats.vampire.win;
      lose = stats.vampire.lose;
      break;

    case "serial-killer":
      win = stats.serialKiller.win;
      lose = stats.serialKiller.lose;
      break;

    case "arsonist":
      win = stats.arsonist.win;
      lose = stats.arsonist.lose;
      break;

    case "survivor":
      win = stats.survivor.win;
      lose = stats.survivor.lose;
      break;

    case "executioner":
      win = stats.executioner.win;
      lose = stats.executioner.lose;
      break;

    default:
      /// calculate total all game play,
      // calculate all win & lose from each team
      Object.keys(stats).forEach(key => {
        let stat = stats[key];
        win += stat.win;
        lose += stat.lose;
      });
  }

  let result = {
    win: win,
    lose: lose
  };

  return result;
}

module.exports = {
  getAllUser: getAllUserData
};
