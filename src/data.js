const client = require("./client");

const util = require("../util");

const personal = require("./personal");
const main = require("./main");
const idle = require("./idle");

const getUserSessions = () => {
  const fs = require("fs");
  const path = require("path");
  let userPath = path.join(__dirname, "../.data/", "user_sessions.json");
  try {
    const data = fs.readFileSync(userPath);
    return JSON.parse(data);
  } catch (err) {
    console.error("err getUserSessions", err);
    const data = {};
    return data;
  }
};

const getGroupSessions = () => {
  const fs = require("fs");
  const path = require("path");
  let groupPath = path.join(__dirname, "../.data/", "group_sessions.json");
  try {
    const data = fs.readFileSync(groupPath);
    return JSON.parse(data);
  } catch (err) {
    console.error("err getGroupSessions", err);
    const data = {};
    return data;
  }
};

// game storage
const group_sessions = getGroupSessions();
const user_sessions = getUserSessions();

// Update session
setInterval(() => {
  for (let key in group_sessions) {
    if (group_sessions[key]) {
      const time = group_sessions[key].time;
      const state = group_sessions[key].state;
      if (state !== "inactive" && time > 0) {
        group_sessions[key].time--;
      } else {
        const playersLength = group_sessions[key].players.length;
        if (playersLength < 5 && state === "new") {
          group_sessions[key].state = "idle";
          resetAllPlayers(group_sessions[key].players);
        } else if (state === "idle") {
          if (group_sessions[key].groupId !== process.env.TEST_GROUP) {
            group_sessions[key].state = "inactive";
          }
        }
      }
    }
  }

  for (let key in user_sessions) {
    if (user_sessions[key]) {
      if (user_sessions[key].cooldown > 0) {
        user_sessions[key].cooldown--;
      }

      if (user_sessions[key].commandCount > 0) {
        user_sessions[key].commandCount = 0;
      }
    }
  }
}, 1000);

const receive = (event, rawArgs) => {
  // handle memberLeft and leave event
  if (event.type === "leave" || event.type === "memberLeft") {
    return handleLeaveEvent(event);
  }

  // eslint-disable-next-line no-prototype-builtins
  if (!event.source.hasOwnProperty("userId")) {
    if (!rawArgs.startsWith("/")) {
      return Promise.resolve(null);
    } else {
      return replyText(
        "💡 Bot ini hanya dukung LINE versi 7.5.0 atau lebih tinggi.\nCoba update dulu LINE nya"
      );
    }
  }

  if (rawArgs.startsWith("/")) {
    rawArgs = rawArgs.trim();
    this.args = rawArgs.split(" ");
    this.args = this.args.map(item => {
      return item.toLowerCase();
    });
  } else {
    this.args = rawArgs.split(" ");
  }

  this.event = event;
  this.rawArgs = rawArgs;

  searchUser();
};

const searchUser = async () => {
  const userId = this.event.source.userId;

  if (!user_sessions[userId]) {
    let newUser = {
      id: userId,
      name: "",
      state: "inactive",
      groupId: "",
      groupName: "",
      commandCount: 0,
      cooldown: 0,
      spamCount: 0
    };
    user_sessions[userId] = newUser;
  }

  if (user_sessions[userId].name === "") {
    try {
      let { displayName } = await client.getProfile(userId);
      user_sessions[userId].name = displayName;
    } catch (err) {
      if (!this.rawArgs.startsWith("/")) {
        return Promise.resolve(null);
      }

      return notAddError();
    }
  }

  searchUserCallback();
};

const searchUserCallback = () => {
  let userId = this.event.source.userId;

  let usingCommand = this.args[0].startsWith("/") ? true : false;
  if (usingCommand) {
    let cooldown = user_sessions[userId].cooldown;

    user_sessions[userId].commandCount++;

    if (cooldown > 0) {
      return Promise.resolve(null);
    }

    let commandCount = user_sessions[userId].commandCount;

    if (commandCount > 2 && cooldown === 0) {
      user_sessions[userId].spamCount++;
      let spamCooldown = user_sessions[userId].spamCount * 5;
      user_sessions[userId].cooldown += spamCooldown;

      let { cooldown, name } = user_sessions[userId];

      return replyText(
        `💡 ${name} melakukan spam! Kamu akan dicuekin bot selama ${cooldown} detik!`
      );
    }
  }

  if (this.event.source.type === "group") {
    return searchGroup(this.event.source.groupId);
  } else if (this.event.source.type === "room") {
    return searchGroup(this.event.source.roomId);
  } else if (user_sessions[userId].state === "active") {
    return searchGroup(user_sessions[userId].groupId);
  } else {
    return idle.receive(
      this.event,
      this.args,
      this.rawArgs,
      user_sessions,
      group_sessions
    );
  }
};

const searchGroup = async groupId => {
  let isMaintenance = process.env.MAINTENANCE === "true" ? true : false;
  let isTestGroup = groupId === process.env.TEST_GROUP ? true : false;
  if (isMaintenance && !isTestGroup) {
    let text = "👋 Sorry, botnya sedang maintenance. ";
    text += "💡 Untuk info lebih lanjut bisa cek di http://bit.ly/openchatww";
    return util.leaveGroup(this.event, groupId, text);
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
      gamePlayed: 0,
      customRoles: [],
      lastFirstBloodIds: [],
      players: []
    };
    group_sessions[groupId] = newGroup;
  }

  if (group_sessions[groupId].state === "inactive") {
    let text = "👋 Sistem mendeteksi tidak ada permainan dalam 5 menit. ";
    text += "Undang kembali jika mau main ya!";
    return util.leaveGroup(this.event, groupId, text);
  }

  if (this.event.source.type === "room") {
    return searchGroupCallback();
  }

  if (group_sessions[groupId].name === "") {
    let { groupName } = await client.getGroupSummary(groupId);
    group_sessions[groupId].name = groupName;
  }

  searchGroupCallback();
};

const searchGroupCallback = () => {
  if (this.event.source.type === "user") {
    personal.receive(
      this.event,
      this.args,
      this.rawArgs,
      user_sessions,
      group_sessions
    );
  } else {
    main.receive(
      this.event,
      this.args,
      this.rawArgs,
      user_sessions,
      group_sessions
    );
  }
};

/** helper func **/

const handleLeaveEvent = event => {
  if (event.type === "memberLeft") {
    const leftId = event.left.members[0].userId;
    if (user_sessions[leftId] && user_sessions[leftId].state === "inactive") {
      // do what
    }
  } else if (event.type === "leave") {
    const groupId = util.getGroupId(event);
    group_sessions[groupId].state = "idle";
    group_sessions[groupId].time = 300;
    if (group_sessions[groupId] && group_sessions[groupId].players.length > 0) {
      return resetAllPlayers(group_sessions[groupId].players);
    }
  }
};

/** message func **/

const replyText = texts => {
  texts = Array.isArray(texts) ? texts : [texts];

  const sender = util.getSender();

  let msg = texts.map(text => {
    return {
      sender,
      type: "text",
      text: text.trim()
    };
  });

  return client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log("err di replyText di data.js", err.originalError.response.data);
  });
};

const notAddError = async () => {
  let userId = this.event.source.userId;
  let text = "";
  try {
    if (this.event.source.type === "group") {
      let groupId = this.event.source.groupId;
      let { displayName } = await client.getGroupMemberProfile(groupId, userId);
      text += "💡 " + displayName;
    } else if (this.event.source.type === "room") {
      let groupId = this.event.source.roomId;
      let { displayName } = await client.getRoomMemberProfile(groupId, userId);
      text += "💡 " + displayName;
    }
    text += " gagal bergabung kedalam game, add dulu botnya" + "\n";
    text += "https://line.me/R/ti/p/" + process.env.BOT_ID;
    return replyText(text);
  } catch (err) {
    console.error("notAddError error", err.originalError.response.data.message);
  }
};

/** save data func **/

const resetAllPlayers = players => {
  players.forEach(item => {
    user_sessions[item.id].state = "inactive";
    user_sessions[item.id].groupId = "";
    user_sessions[item.id].groupName = "";
  });
  players.length = 0;
};

process.on("SIGTERM", () => {
  const fs = require("fs");
  const userPath = "/app/.data/user_sessions.json";
  const groupPath = "/app/.data/group_sessions.json";

  fs.writeFile(userPath, JSON.stringify(user_sessions), err => {
    if (err) console.error("error save user_sessions");
  });

  fs.writeFile(groupPath, JSON.stringify(group_sessions), err => {
    if (err) console.error("error save group_sessions");
    process.exit(0);
  });
});

module.exports = {
  receive,
  resetAllPlayers
};
