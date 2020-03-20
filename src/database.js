const baseUserPath = "/app/.data/users/";
const fs = require("fs");

const users = [];

function getAllUserData() {
  
}

function getData(cb) {
  let pending = 0;
  fs.readdir(baseUserPath, (err, data) => {
    if (err) throw err;
    pending =  data.length;
    getUserPath(data);
  });

  function getUserPath(list) {
    list.forEach((item, index) => {
      if (item.includes("user")) {
        g
      }
    });
  }

  function getUserData(path) {
    fs.readFile(path, (err, data) => {
      let user = JSON.parse(data);
    });
  }
}

module.exports = {
  getAllUser: getAllUserData
};
