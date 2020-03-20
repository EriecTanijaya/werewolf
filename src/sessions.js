const CronJob = require("cron").CronJob;
const helper = require("/app/helper");

// game storage
const group_sessions = {};
const user_sessions = {};

const job = new CronJob("* * * * * *", function() {
  for (let key in group_sessions) {
    if (group_sessions[key]) {
      if (group_sessions[key].state === "idle") {
        helper.resetAllUsers(group_sessions[key], user_sessions);
        continue;
      }

      if (group_sessions[key].time > 0) {
        group_sessions[key].time--;
      } else {
        let state = group_sessions[key].state;
        let playersLength = group_sessions[key].players.length;
        if (playersLength < 5 && state === "new") {
          helper.resetAllUsers(group_sessions[key], user_sessions);
        }
      }
    }
  }
});

job.start();

module.exports = {
  group_sessions: group_sessions,
  user_sessions: user_sessions
};
