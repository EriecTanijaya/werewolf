const baseUserPath = "/app/.data/users/";
const fs = require("fs");
const dbClient = require("/app/src/databaseClient");

async function getAllUserData(team, cb) {
  const users = [];
  let pending = 0;
  // dbClient.query('DROP TABLE IF EXISTS PlayerStats');
  let query = `
    SELECT * FROM PlayerStats
  `;

  let playerData = await dbClient.query(query);

  pending = playerData.rows.length;
  playerData.rows.forEach((item, index) => {
    let user = {
      id: item.id,
      name: item.name,
      points: item.points,
      totalGame: 0,
      winRate: 0
    };

    getStats(user.id).then(stats => {
      if (user.id === "U83caf7c21caa4cb90f5c616e0ef85e3a") {
        //console.log(stats);
      }
      let result = calculateWinLose(team, stats);

      let totalGame = result.win + result.lose;
      let winRate = Math.floor((result.win / totalGame) * 100);

      if (isNaN(winRate)) {
        winRate = 0;
      }

      user.totalGame = totalGame;
      user.winRate = winRate + "%";
      if (team) {
        let points = result.win * 5 + result.lose;
        user.points = points;
      }

      users.push(user);
      if (pending === index + 1) {
        cb(users);
      }
    });
  });
}

function getStats(userId) {
  let stats = {
    villager: {
      win: 0,
      lose: 0
    },
    werewolf: {
      win: 0,
      lose: 0
    },
    vampire: {
      win: 0,
      lose: 0
    },
    jester: {
      win: 0,
      lose: 0
    },
    serialKiller: {
      win: 0,
      lose: 0
    },
    arsonist: {
      win: 0,
      lose: 0
    },
    survivor: {
      win: 0,
      lose: 0
    },
    executioner: {
      win: 0,
      lose: 0
    }
  };

  return new Promise((resolve, reject) => {
    let cnt = 0;
    for (let key in stats) {
      cnt++;
      let teamName = key[0].toUpperCase() + key.substring(1);
      let teamStatQuery = `SELECT win, lose FROM ${teamName}Stats WHERE playerId = '${userId}';`;
      dbClient.query(teamStatQuery).then(stat => {
        if (stat.rows.length !== 0) {
          //console.log(`${userId} : win ${stat.rows[0].win}, lose ${stat.rows[0].lose}`);
          stats[key].win = stat.rows[0].win;
          stats[key].lose = stat.rows[0].lose;
        }

        /// hardcode because our max team is 8
        let maxTeamCount = 8;

        if (cnt === maxTeamCount) {
          if (userId === "U83caf7c21caa4cb90f5c616e0ef85e3a") {
            if (key === "werewolf") {
              console.log(stats);
            }
            
          }
          resolve(stats);
        }
      });
    }
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
