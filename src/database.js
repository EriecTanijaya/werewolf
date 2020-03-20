const baseUserPath = "/app/.data/users/";
const fs = require("fs");

const users = [];

function getAllUserData() {
  fs.readdir(baseUserPath, (err, data) => {
    if (err) throw err;
    getUserPath(data);
  });
}

function getUserPath(list) {
  list.map((item, index) => {
    if (item.includes("user")) {
      getUserData(baseUserPath + item);
      
      if (users.length === index - 1) {
        console.log(users);
        return users;
      }
    }
  });
}

function getUserData(path) {
  fs.readFile(path, (err, data) => {
    let user = JSON.parse(data);
    users.push(user);
  });
}

module.exports = {
  getAllUser: getAllUserData
};