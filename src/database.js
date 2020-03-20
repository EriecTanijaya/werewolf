const baseUserPath = "/app/.data/users/";
const fs = require("fs");

const users = [];

function getAllUserData() {
  getAllData((user) => {
    
  });
}

function getAllData(cb) {
  fs.readdir(baseUserPath, (err, data) => {
    if (err) throw err;
    getUserPath(data);
  });

  function getUserPath(list) {
    list.forEach((item, index) => {
      if (item.includes("user")) {
        getUserData(baseUserPath + item);
      }
    });
  }

  function getUserData(path) {
    fs.readFile(path, (err, data) => {
      let user = JSON.parse(data);
      //cb(user);
    });
  }
}

module.exports = {
  getAllUser: getAllUserData
};
