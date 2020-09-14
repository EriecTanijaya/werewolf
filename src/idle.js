const client = require("./client");
const flex = require("../message/flex");
const util = require("../util");

const info = require("./info");
const stats = require("./stats");
const database = require("../database");

const receive = (event, args, rawArgs, user_sessions, group_sessions) => {
  this.event = event;
  this.args = args;
  this.rawArgs = rawArgs;
  this.user_sessions = user_sessions;
  this.group_sessions = group_sessions;

  let userId = event.source.userId;
  this.user_session = user_sessions[userId];

  if (!rawArgs.startsWith("/")) {
    return Promise.resolve(null);
  }

  let input = args[0].toLowerCase();
  switch (input) {
    case "/help":
      return helpCommand();
    case "/cmd":
      return commandCommand();
    case "/about":
      return aboutCommand();
    case "/info":
      return infoCommand();
    case "/status":
      return statusCommand();
    case "/groups":
      return groupsListCommand();
    case "/users":
      return usersListCommand();
    case "/view":
      return viewCommand();
    case "/tutorial":
      return tutorialCommand();
    case "/forum":
    case "/oc":
    case "/openchat":
      return forumCommand();
    case "/update":
    case "/updates":
      return showUpdatesCommand();
    case "/role":
    case "/news":
    case "/r":
    case "/c":
    case "/skill":
      return notInGameCommand();
    case "/group":
      return groupCommand();
    case "/run":
      return runCommand();
    case "/rank":
      return rankCommand();
    case "/me":
      return meCommand();
    case "/sync":
      return updateName();
    default:
      return invalidCommand();
  }
};

const updateName = async () => {
  const { displayName } = await client.getProfile(this.user_session.id);
  if (this.user_session.name !== displayName) {
    this.user_session.name = displayName;
  }
  const res = await database.updateName(this.user_session.id, displayName);
  return replyText(res);
};

const meCommand = async () => {
  const msg = await util.getSelfData(this.user_session.id);
  if (typeof msg === "string") return replyText(msg);
  return replyFlex(msg);
};

const rankCommand = async () => {
  const flex_text = await util.getRank();
  return replyFlex(flex_text);
};

const runCommand = () => {
  if (this.user_session.id !== process.env.DEV_ID) {
    return invalidCommand();
  }

  try {
    return eval(util.parseToText(this.args));
  } catch (err) {
    return replyText(err.message);
  }
};

const groupCommand = () => {
  const msg = util.getPromotedGroup(this.group_sessions);

  if (typeof msg === "string") return replyText(msg);

  return replyFlex(msg);
};

const notInGameCommand = () => {
  const text = "💡 Kamu sedang tidak berada didalam game";
  return replyText(text);
};

const forumCommand = () => {
  const msg = util.getForumInfo();
  return replyFlex(msg);
};

const tutorialCommand = () => {
  const msg = util.getTutorial();
  return replyFlex(msg);
};

const statusCommand = async () => {
  const msg = await stats.statusCommand(this.user_sessions, this.group_sessions);
  return replyFlex(msg);
};

const groupsListCommand = async () => {
  if (this.user_session.id !== process.env.DEV_ID) {
    return invalidCommand();
  }

  const msg = await stats.groupsListCommand(this.group_sessions);

  if (typeof msg === "string") return replyText(msg);

  return replyFlex(msg);
};

const usersListCommand = async () => {
  if (this.user_session.id !== process.env.DEV_ID) {
    return invalidCommand();
  }

  const msg = await stats.usersListCommand(this.user_sessions);

  if (typeof msg === "string") return replyText(msg);

  return replyFlex(msg);
};

const viewCommand = async () => {
  if (this.user_session.id !== process.env.DEV_ID) {
    return invalidCommand();
  }

  const msg = await stats.viewCommand(this.group_sessions, this.args[1]);

  if (typeof msg === "string") return replyText(msg);

  return replyFlex(msg);
};

const invalidCommand = () => {
  const text = `💡 Tidak ditemukan perintah '${this.args[0]}'. Cek daftar perintah yang ada di '/cmd'`;
  return replyText(text);
};

const infoCommand = () => {
  info.receive(this.event, this.args, this.rawArgs);
};

const aboutCommand = () => {
  const flex_text = util.getAbout();
  return replyFlex(flex_text);
};

const commandCommand = () => {
  const flex_texts = [];
  const cmds = [
    "/help : bantuan game",
    "/about : tentang bot",
    "/info : info role, game mode, role type",
    "/tutorial : tutorial menggunakan bot ini",
    "/forum : link ke openchat",
    "/status : untuk melihat berapa yang online",
    "/updates : untuk melihat 10 update terakhir bot",
    "/group : untuk melihat daftar group yang open",
    "/rank : list top 10 pemain",
    "/me : info data diri sendiri",
    "/sync : sinkronisasi data pemain"
  ];

  let flexNeeded = 0;
  const limit = 8;
  let cnt = 0;
  cmds.forEach((item, index) => {
    cnt++;
    if (cnt === limit || index === cmds.length - 1) {
      flexNeeded++;
      cnt = 0;
    }
  });

  let startPoint = 0; //start
  let limitCheckPoint = 8 > cmds.length ? cmds.length : 8;

  let flex_text = {};
  for (let i = 0; i < flexNeeded; i++) {
    flex_text[i] = {
      headerText: "📚 Daftar Perintah",
      bodyText: ""
    };

    for (startPoint; startPoint < limitCheckPoint; startPoint++) {
      flex_text[i].bodyText += `- ${cmds[startPoint]}\n`;

      if (startPoint === limitCheckPoint - 1 || startPoint === cmds.length - 1) {
        flex_texts.push(flex_text[i]);

        if (limitCheckPoint < cmds.length) {
          let spaceLeft = cmds.length - startPoint + 1;
          let addonLimit = 8 > spaceLeft ? spaceLeft : 8;
          limitCheckPoint += addonLimit;
          startPoint++;
        }

        break;
      }
    }
  }

  return replyFlex(flex_texts);
};

const helpCommand = () => {
  const state = null;
  const flex_text = util.getHelp(state);
  return replyFlex(flex_text);
};

const showUpdatesCommand = () => {
  const updates = util.getUpdates();
  return replyFlex(updates);
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
    console.log("err di replyText di idle.js", err.originalError.response.data);
  });
};

const replyFlex = async flex_raw => {
  const sender = util.getSender();

  const msg = flex.build(flex_raw, sender);
  return await client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log(JSON.stringify(msg));
    console.error("err replyFlex di idle.js", err.originalError.response.data.message);
  });
};

module.exports = {
  receive
};
