const baseUserPath = "/app/.data/users/";
const Stat = require("/app/src/stats");
const fs = require("fs");

const users = [];

function getAllUserData(cb) {
  let pending = 0;
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
            tanner: rawUser.tannerStats,
            serialKiller: rawUser.serialKillerStats,
            arsonist: rawUser.arsonistStats
          };
return console.log(Stat)
          let result = Stat.calculateWinLose(null, stats);
          let totalGame = result.win + result.lose;
          let winRate = Math.floor((result.win / totalGame) * 100);
          if (isNaN(winRate)) {
            winRate = 0;
          }
          let user = {
            name: rawUser.name,
            points: rawUser.points,
            totalGame: totalGame,
            winRate: winRate + "%"
          };
          users.push(user);
          if (pending === index + 1) {
            cb(users);
          }
        });
      }
    });
  });
}

module.exports = {
  getAllUser: getAllUserData
};
