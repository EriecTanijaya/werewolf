const client = require("./client");
const flex = require("../message/flex");
const util = require("../util");

const info = require("./info");
const stats = require("./stats");

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
    default:
      return invalidCommand();
  }
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
  const text = `💡 Tidak ditemukan perintah '${
    this.args[0]
  }'. Cek daftar perintah yang ada di '/cmd'`;
  return replyText(text);
};

const infoCommand = () => {
  info.receive(this.event, this.args);
};

const aboutCommand = () => {
  const flex_text = util.getAbout();
  return replyFlex(flex_text);
};

const commandCommand = () => {
  let text = "";
  const cmds = [
    "/help : bantuan game",
    "/about : tentang bot",
    "/info : info role, game mode, role type",
    "/tutorial : tutorial menggunakan bot ini",
    "/forum : link ke openchat",
    "/status : untuk melihat berapa yang online",
    "/updates : untuk melihat 5 update terakhir bot"
  ];

  cmds.forEach((item, index) => {
    text += "- " + item;
    if (index !== cmds.length - 1) {
      text += "\n";
    }
  });

  const flex_text = {
    headerText: "📚 Daftar Perintah",
    bodyText: text
  };

  return replyFlex(flex_text);
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
    console.log("err di replyText di idle.js", err.originalError.response.data);
  });
};

const replyFlex = flex_raw => {
  const sender = util.getSender();

  const msg = flex.build(flex_raw, sender);
  return client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log(JSON.stringify(msg));
    console.error(
      "err replyFlex di idle.js",
      err.originalError.response.data.message
    );
  });
};

module.exports = {
  receive
};
