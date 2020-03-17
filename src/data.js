const fs = require("fs");

// game storage
var group_sessions = {};
var user_sessions = {};

//Thanks to
//https://stackoverflow.com/questions/36629604/node-js-socket-io-multiple-timer-for-rooms
setInterval(() => {
  for (let key in group_sessions) {
    if (group_sessions[key]) {
      if (group_sessions[key].time > 0) {
        group_sessions[key].time--;
      }
    }
  }
}, 1000);

module.exports = {
  receive: function(client, event, rawArgs) {
    this.client = client;
    this.event = event;
    this.rawArgs = rawArgs;

    if (!this.event.source.hasOwnProperty("userId")) {
      if (!this.rawArgs.startsWith("/")) {
        return Promise.resolve(null);
      } else {
        return this.replyText(
          "💡 This bot only support LINE version 7.5.0 or higher.\nTry updating, block, and re-add this bot."
        );
      }
    }

    let groupId = "";
    if (this.event.source.type === "group") {
      groupId = this.event.source.groupId;
    } else if (this.event.source.type === "room") {
      groupId = this.event.source.roomId;
    }

    this.args = this.rawArgs.split(" ");
    this.searchUser(this.event.source.userId);
  },

  searchUser: function(id) {
    if (!user_sessions[id]) {
      let newUser = {
        id: id,
        name: "",
        state: "inactive",
        groupId: "",
        points: 0,
        villagerStats: {
          win: 0,
          lose: 0
        },
        werewolfStats: {
          win: 0,
          lose: 0
        },
        vampireStats: {
          win: 0,
          lose: 0
        },
        tannerStats: {
          win: 0,
          lose: 0
        },
        serialKillerStats: {
          win: 0,
          lose: 0
        },
        arsonistStats: {
          win: 0,
          lose: 0
        }
      };
      user_sessions[id] = newUser;
    }

    let userData = user_sessions[id];

    if (userData.name === "") {
      this.client
        .getProfile(userData.id)
        .then(profile => {
          userData.name = profile.displayName;
          return this.searchUserCallback(userData);
        })
        .catch(err => {
          let event = this.event;
          if (!this.rawArgs.startsWith("/")) {
            return Promise.resolve(null);
          }
          console.log("err di searchUser func di data.js", err);
          return this.notAddError(userData.id);
        });
    } else {
      return this.searchUserCallback(user_sessions[id]);
    }
  },

  searchUserCallback: function(userData) {
    if (this.event.source.type === "group") {
      return this.searchGroup(userData, this.event.source.groupId);
    } else if (this.event.source.type === "room") {
      return this.searchGroup(userData, this.event.source.roomId);
    } else if (userData.state === "active") {
      return this.searchGroup(userData, userData.groupId);
    } else {
      const idle = require("/app/src/idle");
      return idle.receive(
        this.client,
        this.event,
        this.args,
        this.rawArgs,
        userData
      );
    }
  },

  searchGroup: function(user_session, groupId) {
    /// for maintenance
    if (this.rawArgs.startsWith("/")) {
      // logging
      console.log(this.args);
      if (user_session.id !== process.env.DEV_ID) {
        
        // semua grup ga bisa
        //return this.maintenanceRespond();
        
        // buat khusus test grup aja
        if (groupId !== process.env.TEST_GROUP) {
          //return this.maintenanceRespond();
        }
      }
    }

    if (!group_sessions[groupId]) {
      let newGroup = {
        groupId: groupId,
        state: "idle",
        time_default: 0,
        time: 0,
        status: "active",
        players: []
      };
      group_sessions[groupId] = newGroup;
    }

    this.searchGroupCallback(user_session, group_sessions[groupId]);
  },

  searchGroupCallback: function(user_session, group_session) {
    return this.forwardProcess(user_session, group_session);
  },

  forwardProcess: function(user_session, group_session) {
    if (this.event.source.type === "user") {
      const personal = require("/app/src/personal");
      return personal.receive(
        this.client,
        this.event,
        this.args,
        this.rawArgs,
        user_session,
        group_session
      );
    } else {
      const werewolf = require("/app/src/werewolf");
      return werewolf.receive(
        this.client,
        this.event,
        this.args,
        this.rawArgs,
        user_session,
        group_session
      );
    }
  },

  /** message func **/

  notAddError: function(userId) {
    let groupId = "";
    if (this.event.source.type === "group") {
      groupId = this.event.source.groupId;
      this.client
        .getGroupMemberProfile(groupId, userId)
        .then(u => {
          return this.replyText(
            "💡 " +
              u.displayName +
              " gagal bergabung kedalam game, add dulu botnya\nline://ti/p/@218mdfal"
          );
        })
        .catch(err => {
          console.log("not add err", err.originalError.response.data);
        });
    } else if (this.event.source.type === "room") {
      groupId = this.event.source.roomId;
      this.client.getRoomMemberProfile(groupId, userId).then(u => {
        return this.replyText(
          "💡 " +
            u.displayName +
            " gagal bergabung kedalam game, add dulu botnya\nline://ti/p/@218mdfal"
        );
      });
    }
  },

  maintenanceRespond: function() {
    let groupId = "";

    if (this.event.source.type === "group") {
      groupId = this.event.source.groupId;
    } else if (this.event.source.type === "room") {
      groupId = this.event.source.roomId;
    }
    
    let text = "💡 Untuk info lebih lanjut bisa cek di http://bit.ly/openchatww";

    this.client
      .getGroupMemberProfile(groupId, this.event.source.userId)
      .then(profile => {
        return this.client.replyMessage(this.event.replyToken, {
          type: "text",
          text:
            "👋 Sorry " + profile.displayName + ", botnya sedang maintenance. " + text
        });
      })
      .catch(err => {
        // error handling
        console.log("ada error di maintenanceRespond func", err);
      });
  },

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return this.client.replyMessage(
      this.event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  },

  /** save data func **/

  saveUserData: function(user_session) {
    // console.log("saved user_session", user_session.state);
    let path = "/app/.data/users/" + user_session.id + "_user.json";
    let data = JSON.stringify(user_session, null, 2);
    fs.writeFileSync(path, data);
    
    if (user_session.state === "inactive") {
      user_sessions[user_session.id] = null;
    }
  },

  saveGroupData: function(group_session) {
    // console.log("saved group_session", group_session.players);
    let path = "/app/.data/groups/" + group_session.groupId + "_group.json";
    let data = JSON.stringify(group_session, null, 2);
    fs.writeFileSync(path, data);

    if (group_session.state === "idle") {
      this.resetRoom(group_session.groupId);
    }
  },

  getUserData: function(id, newUserData) {
    const baseUserPath = "/app/.data/users/";
    let userPath = baseUserPath + id + "_user.json";
    let user_session = {};
    fs.readFile(userPath, "utf8", (err, data) => {
      if (err) return this.replyText("💡 Belum ada data usernya");
      user_session = JSON.parse(data);
      this.updateUserData(user_session, newUserData);
    });
  },

  updateUserData: function(oldUserData, newUserData) {
    oldUserData.state = newUserData.state;
    oldUserData.groupId = newUserData.groupId;

    oldUserData.points += newUserData.points;
    if (oldUserData.points < 0) {
      oldUserData.points = 0;
    }

    oldUserData.villagerStats.win += newUserData.villagerStats.win;
    oldUserData.villagerStats.lose += newUserData.villagerStats.lose;

    oldUserData.werewolfStats.win += newUserData.werewolfStats.win;
    oldUserData.werewolfStats.lose += newUserData.werewolfStats.lose;

    oldUserData.vampireStats.win += newUserData.vampireStats.win;
    oldUserData.vampireStats.lose += newUserData.vampireStats.lose;

    oldUserData.tannerStats.win += newUserData.tannerStats.win;
    oldUserData.tannerStats.lose += newUserData.tannerStats.lose;

    oldUserData.serialKillerStats.win += newUserData.serialKillerStats.win;
    oldUserData.serialKillerStats.lose += newUserData.serialKillerStats.lose;

    oldUserData.arsonistStats.win += newUserData.arsonistStats.win;
    oldUserData.arsonistStats.lose += newUserData.arsonistStats.lose;

    this.saveUserData(oldUserData);
  },

  resetAllPlayers: function(players) {
    players.forEach(item => {
      let reset_player = {
        id: item.id,
        name: item.name,
        state: "inactive",
        groupId: item.groupId,
        points: item.points,
        //dibawah ntr tmbahin team team yang ada
        villagerStats: item.villagerStats,
        werewolfStats: item.werewolfStats,
        vampireStats: item.vampireStats,
        tannerStats: item.tannerStats,
        serialKillerStats: item.serialKillerStats,
        arsonistStats: item.arsonistStats
      };

      this.getUserData(item.id, reset_player);
    });
  },

  resetRoom: function(groupId) {
    group_sessions[groupId] = null;
  }
};
