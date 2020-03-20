const baseUserPath = "/app/.data/users/";
const fs = require("fs");

// Update Ranking
function updateRank() {
  
}

let users = fs
  .readdirSync(baseUserPath)
  .filter(u => {
    if (!u.includes("user")) {
      return false;
    }
    return true;
  })
  .map((item, index) => {
    let data = fs.readFileSync(baseUserPath + item);
    let rawUser = JSON.parse(data);
  });

// const updateRankJob = new CronJob("* * * * * *", function() {
  
// });

updateRank.start();

module.exports = updateRank;
