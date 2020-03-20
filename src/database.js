const baseUserPath = "/app/.data/users/";
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
          let user = JSON.parse(data);
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
