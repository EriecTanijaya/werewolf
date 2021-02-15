const client = require("./client");
const flex = require("../message/flex");
const util = require("../util");
const respond = require("../message/respond");
const personal = require("./personal");
const main = require("./main");
const idle = require("./idle");
const database = require("../database");

// commands list
const safeCommands = [
  "/cmd",
  "/help",
  "/gamestat",
  "/players",
  "/player",
  "/pemain",
  "/p",
  "/about",
  "/status",
  "/info",
  "/roles",
  "/rolelist",
  "/tutorial",
  "/role",
  "/news",
  "/extend",
  "/kick",
  "/bye",
  "/reset",
  "/forum",
  "/oc",
  "/openchat",
  "/update",
  "/updates",
  "/rank",
  "/peringkat",
  "/ranking"
];

// game storage
const group_sessions = {};
const user_sessions = {};

// Update session
setInterval(() => {
  for (let key in group_sessions) {
    if (group_sessions[key]) {
      const time = group_sessions[key].time;
      if (time > 0) {
        group_sessions[key].time--;
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

      if (user_sessions[key].state === "inactive") {
        if (user_sessions[key].time > 0) {
          user_sessions[key].time--;
        } else {
          user_sessions[key] = null;
        }
      }
    }
  }
}, 1000);

const receive = async (event, rawArgs) => {
  this.event = event;

  // handle other events but let other event message type flow
  const otherEvents = ["follow", "memberJoined", "join", "leave", "memberLeft", "unfollow"];
  if (otherEvents.includes(event.type)) {
    return handleOtherEvent(event);
  }

  // eslint-disable-next-line no-prototype-builtins
  if (!event.source.hasOwnProperty("userId")) {
    if (!rawArgs.startsWith("/")) {
      return Promise.resolve(null);
    } else {
      return replyText("💡 Bot ini hanya dukung LINE versi 7.5.0 atau lebih tinggi.\nCoba update dulu LINE nya");
    }
  }

  this.args = rawArgs.split(" ");
  this.rawArgs = rawArgs;

  const usingCommand = this.args[0].startsWith("/") ? true : false;

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
      spamCount: 0,
      time: 300
    };
    user_sessions[userId] = newUser;
  }

  if (user_sessions[userId].name === "") {
    const input = this.args[0].toLowerCase();
    try {
      const { displayName } = await client.getProfile(userId);
      user_sessions[userId].name = displayName;
    } catch (err) {
      if (!usingCommand) {
        return Promise.resolve(null);
      }

      if (["/join", "/j"].includes(input)) {
        return notAddError();
      }

      if (!safeCommands.includes(input)) {
        return Promise.resolve(null);
      }
    }
  }

  if (usingCommand) {
    const cooldown = user_sessions[userId].cooldown;

    user_sessions[userId].commandCount++;

    if (cooldown > 0) {
      return Promise.resolve(null);
    }

    const commandCount = user_sessions[userId].commandCount;

    if (commandCount > 2 && cooldown === 0) {
      user_sessions[userId].spamCount++;
      const spamCooldown = user_sessions[userId].spamCount * 5;
      user_sessions[userId].cooldown += spamCooldown;

      const { cooldown, name } = user_sessions[userId];
      return replyText(`💡 ${name} melakukan spam! Kamu akan dicuekin bot selama ${cooldown} detik!`);
    }
  }

  if (this.event.source.type === "user") {
    if (user_sessions[userId].state === "inactive") {
      return idle.receive(this.event, this.args, this.rawArgs, user_sessions, group_sessions);
    } else {
      return personal.receive(this.event, this.args, this.rawArgs, user_sessions, group_sessions);
    }
  }

  let groupId = "";
  if (this.event.source.type === "group") {
    groupId = this.event.source.groupId;
  } else if (this.event.source.type === "room") {
    groupId = this.event.source.roomId;
  }

  const isMaintenance = process.env.MAINTENANCE === "true" ? true : false;
  const isTestGroup = groupId === process.env.TEST_GROUP ? true : false;

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
      mode: "beginner",
      isShowRole: true,
      stay: false,
      customRoles: [],
      lastFirstBloodIds: [],
      currentFirstBloodIds: [],
      players: []
    };
    group_sessions[groupId] = newGroup;
  }

  const groupAvailableTime = group_sessions[groupId].time;
  const isStay = group_sessions[groupId].stay;
  const playersLength = group_sessions[groupId].players.length;
  const hasMinimumPlayers = playersLength > 4 ? true : false;

  if (!groupAvailableTime && !usingCommand && !isStay && !hasMinimumPlayers) {
    const groupState = group_sessions[groupId].state;
    if (playersLength < 5 && groupState === "new") {
      group_sessions[groupId].state = "idle";
      resetAllPlayers(group_sessions[groupId].players);
    }

    let text = "👋 Sistem mendeteksi tidak ada permainan dalam 5 menit. ";
    text += "Undang kembali jika mau main ya!";
    return util.leaveGroup(this.event, groupId, text);
  }

  if (this.event.source.type === "group" && group_sessions[groupId].name === "") {
    let { groupName } = await client.getGroupSummary(groupId);
    group_sessions[groupId].name = groupName;
  }

  return main.receive(this.event, this.args, this.rawArgs, user_sessions, group_sessions);
};

/** helper func **/

const handleOtherEvent = () => {
  switch (this.event.type) {
    case "memberLeft":
      return memberLeftResponse();
    case "leave":
      return leaveResponse();
    case "join":
      return joinResponse();
    case "follow":
      return followResponse();
    case "memberJoined":
      return memberJoinedResponse();
    case "unfollow":
      return unfollowResponse();
  }
};

const unfollowResponse = () => {
  const userId = this.event.source.userId;
  database.remove(userId);
};

const leaveResponse = () => {
  const groupId = util.getGroupId(this.event);
  if (group_sessions[groupId] && group_sessions[groupId].players.length > 0) {
    group_sessions[groupId].state = "idle";
    return resetAllPlayers(group_sessions[groupId].players);
  }
};

const memberLeftResponse = () => {
  const leftId = this.event.left.members[0].userId;
  if (user_sessions[leftId] && user_sessions[leftId].state === "inactive") {
    // do what
  }
};

const joinResponse = async () => {
  const groupId = util.getGroupId(this.event);
  const isMaintenance = process.env.MAINTENANCE === "true" ? true : false;
  const isTestGroup = groupId === process.env.TEST_GROUP ? true : false;

  if (isMaintenance && !isTestGroup) {
    let text = "👋 Sorry, botnya sedang maintenance. ";
    text += "💡 Untuk info lebih lanjut bisa cek di http://bit.ly/openchatww";
    util.leaveGroup(this.event, groupId, text);
  }

  let text = "";

  if (group_sessions[groupId]) {
    group_sessions[groupId].state = "idle";
    group_sessions[groupId].time = 300;
  }

  if (this.event.source.type === "group") {
    let { groupName } = await getGroupData(groupId);
    text = "Thanks udah diundang ke " + groupName + "! ";
  } else {
    text = "Thanks udah diundang ke room ini! ";
  }

  text += "😃 Ketik '/tutorial' atau '/cmd' untuk bantuan. ";
  text += "😕 Jika masih bingung, boleh ke '/forum'";

  let flex_text = {
    headerText: "👋 Hai semua!",
    bodyText: text
  };
  return replyFlex(flex_text);
};

const followResponse = () => {
  const flex_text = {
    headerText: "👋 Haiii",
    bodyText:
      "Thanks udah add bot ini 😃, undang bot ini ke group kamu untuk bermain!\n📚 Untuk bantuan bisa ketik '/tutorial' atau '/cmd'"
  };
  let text = "🏘️ Untuk kamu yang belum ada group, bisa nyari di '/forum'";

  return replyFlex(flex_text, text);
};

const memberJoinedResponse = async () => {
  const groupId = util.getGroupId(this.event);
  const newMemberId = this.event.joined.members[0].userId;

  if (this.event.source.type === "group") {
    let { displayName } = await client.getGroupMemberProfile(groupId, newMemberId);
    let { groupName } = await getGroupData(groupId);
    return replyText(respond.memberJoined(displayName, groupName));
  } else if (this.event.source.type === "room") {
    let { displayName } = await client.getRoomMemberProfile(groupId, newMemberId);
    return replyText(`👋 Selamat datang ${displayName}!`);
  }
};

const getGroupData = async groupId => {
  const groupData = await client.getGroupSummary(groupId);
  return groupData;
};

/** message func **/

const replyText = async texts => {
  texts = Array.isArray(texts) ? texts : [texts];

  const sender = util.getSender();

  let msg = texts.map(text => {
    return {
      sender,
      type: "text",
      text: text.trim()
    };
  });

  return await client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log("err di replyText di data.js", err.originalError.response.data);
  });
};

const replyFlex = async (flex_raw, text_raw) => {
  let opt_texts = [];
  if (text_raw) {
    text_raw = Array.isArray(text_raw) ? text_raw : [text_raw];
    opt_texts = text_raw.map(item => {
      return { type: "text", text: item };
    });
  }

  const sender = util.getSender();

  const msg = flex.build(flex_raw, sender, opt_texts);
  return await client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log(JSON.stringify(msg));
    console.error("err replyFlex di data.js", err.originalError.response.data.message);
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
    text += " gagal bergabung kedalam game, add dulu botnya ya" + "\n";
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
    user_sessions[item.id].time = 300;
  });
  players = [];
};

module.exports = {
  receive,
  resetAllPlayers
};
