const baseUserPath = "/app/.data/users/";
const fs = require("fs");

// Update Ranking
// TODO: avoid callback hell
function updateRank() {
  fs.readdir(baseUserPath, (err, data) => {
    if (err) throw err;
    data.map((item, index) => {
      if (item.includes("user")) {
        fs.readFile(baseUserPath + item, (err, data) => {
          let user = JSON.parse(data);
          user.points = 0;
          let toSaveUser = JSON.stringify(user, null, 2);
          fs.writeFile(baseUserPath + item, toSaveUser, (err) => {
            if (err) {
              throw err;
            } else {
              console.log("user reset successfuly", user);
            }
          })
        });
      }
    });
  });
}

module.exports = updateRank;
