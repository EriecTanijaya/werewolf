const client = require("./client");
const flex = require("../message/flex");
const util = require("../util");
const rolesData = require("../roles/rolesData");
const rolesInfo = require("../roles/rolesInfo");
const stats = require("../src/stats");
const helpFlex = require("../message/help");

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

const showUpdatesCommand = () => {
  const updates = util.getUpdates();
  console.log(updates);
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
    console.error("err replyFlex di idle.js", err.originalError.response.data.message);
  });
};

module.exports = {
  receive
}
