const client = require("./client");
const flex = require("../message/flex");
const util = require("../util");
const rolesData = require("../roles/rolesData");
const rolesInfo = require("../roles/rolesInfo");

const info = require("./info");
const stats = require("./stats");

const receive = (event, args, rawArgs, user_sessions) => {
  this.event = event;
  this.args = args;
  this.rawArgs = rawArgs;
  this.user_sessions = user_sessions;

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
    case "/groups":
    case "/users":
    case "/view":
      return statCommand();
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

const infoCommand = () => {
  info.receive(this.event, this.args);
}

const aboutCommand = () => {
  let flex_text = util.getAbout();
  return replyFlex(flex_text);
}

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

const replyFlex = flex_raw => {
  const senderEmojiRoles = rolesData.map(role => {
    let roleName = role.name[0].toUpperCase() + role.name.substring(1);
    return { name: roleName, iconUrl: role.iconUrl };
  });

  const { name, iconUrl } = util.random(senderEmojiRoles);
  const sender = { name, iconUrl };

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
