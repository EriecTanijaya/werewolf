const dbClient = require("/app/src/databaseClient");

// Reset User Points
function resetUsersPoint() {
  let query = `UPDATE PlayerStats SET points = 0;`;
  dbClient.query(query).then(() => {
    let date = new Date();
    console.log(`Done reset data on ${date}`);
  })
}

module.exports = {
  usersPoint: resetUsersPoint
};
