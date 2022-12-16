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

  const userId = event.source.userId;
  this.user_session = user_sessions[userId];

  if (!rawArgs.startsWith("/")) {
    return Promise.resolve(null);
  }

  const input = args[0].toLowerCase();
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
    case "/cek":
      return notInGameCommand();
    case "/pesan":
      return sendToDevMessageCommand();
    default:
      return invalidCommand();
  }
};

const sendToDevMessageCommand = () => {
  if (this.args.length < 2) {
    return replyText("💡 Masukkan pesan. Cth: /pesan pesan");
  }

  const message = util.parseToText(this.args);
  const timestamp = new Date().getTime();
  const time = new Date(timestamp).toLocaleTimeString("en-US", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit"
  });

  let text = "";
  text += `[${time}] `;
  text += `${this.user_session.name}: ${message}`;

  client
    .pushMessage(process.env.DEV_ID, { type: "text", text: text })
    .then(() => {
      return replyText("✉️ Pesanmu telah dikirim!");
    })
    .catch(() => {
      this.user_session.messages.push({
        message: util.parseToText(this.args),
        timestamp: new Date().getTime()
      });

      return replyText("✉️ Pesanmu telah dikirim!");
    });
};

const notInGameCommand = () => {
  const text = "💡 Kamu sedang tidak berada didalam game atau game telah selesai";
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
  return replyText(msg);
};

const usersListCommand = async () => {
  if (this.user_session.id !== process.env.DEV_ID) {
    return invalidCommand();
  }

  const msg = await stats.usersListCommand(this.user_sessions);
  return replyText(msg);
};

const viewCommand = async () => {
  if (this.user_session.id !== process.env.DEV_ID) {
    return invalidCommand();
  }

  const msg = await stats.viewCommand(this.group_sessions, this.args[1]);
  return replyText(msg);
};

const invalidCommand = () => {
  if (util.hasBadWord(this.args[0])) {
    const randomImageLink = util.getBruhImage();
    return replyImage(randomImageLink);
  }

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
    "/updates : untuk melihat 12 update terakhir bot",
    "/pesan pesan : untuk mengirimkan pesan kepada dev bot"
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

  const sender = {
    name: "Moderator",
    iconUrl:
      "https://cdn.glitch.com/fc7de31a-faeb-4c50-8a38-834ec153f590%2F%E2%80%94Pngtree%E2%80%94microphone%20vector%20icon_3725450.png?v=1587456628843"
  };

  const msg = texts.map(text => {
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
  const sender = {
    name: "Moderator",
    iconUrl:
      "https://cdn.glitch.com/fc7de31a-faeb-4c50-8a38-834ec153f590%2F%E2%80%94Pngtree%E2%80%94microphone%20vector%20icon_3725450.png?v=1587456628843"
  };

  const msg = await flex.build(flex_raw, sender);
  return await client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log(JSON.stringify(msg));
    console.error("err replyFlex di idle.js", err.originalError.response.data.message);
  });
};

const replyImage = async imageLink => {
  return await client.replyMessage(this.event.replyToken, {
    type: "image",
    originalContentUrl: imageLink,
    previewImageUrl: imageLink
  });
};

module.exports = {
  receive
};
