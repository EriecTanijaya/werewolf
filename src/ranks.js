const baseUserPath = "/app/.data/users/";
const fs = require("fs");

// Update Ranking
function updateRank() {
  fs.readdir(baseUserPath, (err, data) => {
    if (err) throw err;
    data.map((item, index) => {
      if (item.includes("user")) {
        fs.readFile(baseUserPath + item, (err, data) => {
          let user = JSON.parse(data);
          console.log(user);
        });
      }
    });
  });
}

module.exports = updateRank;
