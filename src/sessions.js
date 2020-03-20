const CronJob = require("cron").CronJob;
const helper = require("/app/helper");

// game storage
const group_sessions = {};
const user_sessions = {};

// Update session
const updateSessionJob = new CronJob("* * * * * *", function() {
  for (let key in group_sessions) {
    if (group_sessions[key]) {
      if (group_sessions[key].state === "idle") {
        helper.resetAllUsers(group_sessions, user_sessions, key);
        continue;
      }

      if (group_sessions[key].time > 0) {
        group_sessions[key].time--;
      } else {
        let state = group_sessions[key].state;
        let playersLength = group_sessions[key].players.length;
        console.log("di sessions.js", group_sessions[key]);
        if (playersLength < 5 && state === "new") {
          helper.resetAllUsers(group_sessions, user_sessions, key);
        }
      }
    }
  }
});

updateSessionJob.start();

module.exports = {
  group_sessions: group_sessions,
  user_sessions: user_sessions
};
