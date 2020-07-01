const helper = require("/app/helper");
const personal = require("/app/src/personal");
const main = require("/app/src/main");
const idle = require("/app/src/idle");
const rolesData = require("/app/roles/rolesData");

// game storage
const group_sessions = {};
const user_sessions = {};

// Update session
setInterval(() => {
  for (let key in group_sessions) {
    if (group_sessions[key]) {
      if (group_sessions[key].time > 0) {
        group_sessions[key].time--;
      } else {
        let state = group_sessions[key].state;
        let playersLength = group_sessions[key].players.length;
        if (playersLength < 5 && state === "new") {
          helper.resetAllUsers(group_sessions, user_sessions, key);
        } else if (state === "idle") {
          if (group_sessions[key].groupId !== process.env.TEST_GROUP) {
            group_sessions[key].state = "inactive";
          }
        }
      }
    }
  }
}, 1000);

module.exports = {
  receive: function(client, event, rawArgs) {
    this.client = client;
    this.event = event;
    this.rawArgs = rawArgs;

    this.args = this.rawArgs.split(" ");
    this.searchUser(this.event.source.userId);
  },

  searchUser: async function(id) {
    if (!id) {
      if (!this.rawArgs.startsWith("/")) {
        return Promise.resolve(null);
      } else {
        return this.replyText(
          "💡 This bot only support LINE version 7.5.0 or higher.\nTry updating, block, and re-add this bot."
        );
      }
    }

    if (!user_sessions[id]) {
      let newUser = {
        id: id,
        name: "",
        state: "inactive",
        groupId: "",
        groupName: ""
      };
      user_sessions[id] = newUser;
    }

    let userData = user_sessions[id];

    if (userData.name === "") {
      try {
        let profile = await this.client.getProfile(userData.id);
        userData.name = profile.displayName;
        return this.searchUserCallback(userData);
      } catch (err) {
        if (!this.rawArgs.startsWith("/")) {
          return Promise.resolve(null);
        }
        return this.notAddError(userData.id);
      }
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
      return idle.receive(
        this.client,
        this.event,
        this.args,
        this.rawArgs,
        userData
      );
    }
  },

  searchGroup: async function(user_session, groupId) {
    /// maintenance
    let isMaintenance = process.env.MAINTENANCE === "true" ? true : false;
    let isTestGroup = groupId === process.env.TEST_GROUP ? true : false;
    if (isMaintenance && !isTestGroup) {
      let text = "👋 Sorry, botnya sedang maintenance. ";
      text += "💡 Untuk info lebih lanjut bisa cek di http://bit.ly/openchatww";
      return this.client
        .replyMessage(this.event.replyToken, {
          type: "text",
          text: text
        })
        .then(() => {
          if (this.event.source.type === "group") {
            return this.client.leaveGroup(groupId);
          } else {
            return this.client.leaveRoom(groupId);
          }
        });
    }

    if (!group_sessions[groupId]) {
      let newGroup = {
        groupId: groupId,
        name: "",
        state: "idle",
        time_default: 0,
        time: 300,
        mode: "classic",
        isShowRole: true,
        customRoles: [],
        players: []
      };
      group_sessions[groupId] = newGroup;
    }

    if (group_sessions[groupId].state === "inactive") {
      let text = "👋 Sistem mendeteksi tidak ada permainan dalam 5 menit. ";
      text += "Undang kembali jika mau main ya!";
      return this.client
        .replyMessage(this.event.replyToken, {
          type: "text",
          text: text
        })
        .then(() => {
          if (this.event.source.type === "group") {
            this.client.leaveGroup(groupId);
          } else {
            this.client.leaveRoom(groupId);
          }
        });
    }
    
    if (this.event.source.type === "room") {
      return this.searchGroupCallback(user_session, group_sessions[groupId]);
    }
    
    if (group_sessions[groupId].name === "") {
      let groupData = await this.client.getGroupSummary(groupId);
      group_sessions[groupId].name = groupData.groupName;
      return this.searchGroupCallback(user_session, group_sessions[groupId]);
    } else {
      return this.searchGroupCallback(user_session, group_sessions[groupId]);
    }
  },

  searchGroupCallback: function(user_session, group_session) {
    return this.forwardProcess(user_session, group_session);
  },

  forwardProcess: function(user_session, group_session) {
    if (this.event.source.type === "user") {
      return personal.receive(
        this.client,
        this.event,
        this.args,
        this.rawArgs,
        user_session,
        group_session
      );
    } else {
      return main.receive(
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

  notAddError: async function(userId) {
    let text = "";
    try {
      if (this.event.source.type === "group") {
        let groupId = this.event.source.groupId;
        let profile = await this.client.getGroupMemberProfile(groupId, userId);
        text += "💡 " + profile.displayName;
      } else if (this.event.source.type === "room") {
        let groupId = this.event.source.roomId;
        let profile = await this.client.getRoomMemberProfile(groupId, userId);
        text += "💡 " + profile.displayName;
      }
      text += " gagal bergabung kedalam game, add dulu botnya" + "\n";
      text += "https://line.me/R/ti/p/" + process.env.BOT_ID;
      return this.replyText(text);
    } catch (err) {
      console.log("notAddError error", err.originalError.response.data);
    }
  },

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];

    let sender = {
      name: "",
      iconUrl: ""
    };

    let roles = rolesData.map(role => {
      let roleName = role.name[0].toUpperCase() + role.name.substring(1);
      return {
        name: roleName,
        iconUrl: role.iconUrl
      };
    });

    let role = helper.random(roles);

    sender.name = role.name;
    sender.iconUrl = role.iconUrl;

    let msg = texts.map(text => {
      return {
        sender: sender,
        type: "text",
        text: text.trim()
      };
    });

    return this.client.replyMessage(this.event.replyToken, msg).catch(err => {
      console.log(
        "err di replyText di data.js",
        err.originalError.response.data
      );
    });
  },

  /** save data func **/

  resetAllPlayers: function(players) {
    players.forEach(item => {
      // let reset_player = {
      //   id: item.id,
      //   name: item.name
      // };

      this.resetUser(item.id);
    });
    //this.resetRoom(groupId);
  },

  resetRoom: function(groupId) {
    group_sessions[groupId] = null;
  },

  resetUser: function(userId) {
    user_sessions[userId] = null;
  },

  resetAllUsers: function(groupId) {
    if (group_sessions[groupId]) {
      group_sessions[groupId].players.forEach(item => {
        this.resetUser(item.id);
      });
      this.resetRoom(groupId);
    }
  },

  /** helper func **/

  handleLeftUser: function(userId) {
    if (user_sessions[userId] && user_sessions[userId].state === "inactive") {
      this.resetUser(userId);
    }
  },

  getOnlineUsers: function() {
    let onlineUsers = [];
    Object.keys(user_sessions).forEach(key => {
      let user = user_sessions[key];
      if (user && user.state === "active") {
        onlineUsers.push(user);
      }
    });
    return onlineUsers;
  },

  getOnlineGroups: function() {
    let onlineGroups = [];
    Object.keys(group_sessions).forEach(key => {
      let group = group_sessions[key];
      if (group && group.state !== "idle" && group.state !== "inactive") {
        onlineGroups.push(group);
      }
    });
    return onlineGroups;
  }
};
