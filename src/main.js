const client = require("./client");
const util = require("../util");
const attackedMsg = require("../message/attack");
const peaceMsg = require("../message/peace");
const punishment = require("../message/punishment");
const flex = require("../message/flex");
const setting = require("../src/setting");
const helpFlex = require("../message/help");
const stats = require("./stats");
const info = require("./info");

const receive = (event, args, rawArgs, user_sessions, group_sessions) => {
  this.event = event;
  this.args = args;
  this.rawArgs = rawArgs;
  this.user_sessions = user_sessions;
  this.group_sessions = group_sessions;
  this.user_session = user_sessions[event.source.userId];
  const groupId = util.getGroupId(event);
  this.group_session = group_sessions[groupId];

  if (!rawArgs.startsWith("/")) {
    let time = this.group_session.time;
    const state = this.group_session.state;

    if (state !== "idle") {
      if (state !== "new") {
        if (time <= 10 && time > 0) {
          let reminder = "💡 Waktu tersisa " + time;
          reminder += " detik lagi, nanti ketik '/cek' ";
          reminder += "saat waktu sudah habis untuk lanjutkan proses. ";
          return replyText(reminder);
        } else if (time === 0) {
          if (indexOfPlayer() !== -1) {
            return checkCommand();
          }
        }

        // special role yang bisa trigger lewat text biasa
        let players = this.group_session.players;
        const index = indexOfPlayer();
        if (index !== -1) {
          if (state === "day" || state === "vote") {
            let roleName = players[index].role.name;
            if (roleName === "mayor" && players[index].status === "alive") {
              if (players[index].role.revealed) return Promise.resolve(null);
              let string = args.join(" ");
              string = string.toLowerCase();
              if (string.includes("mayor")) {
                const subjects = ["aku", "ak", "gw", "gue", "gua", "saya"];

                for (let i = 0; i < subjects.length; i++) {
                  if (string.indexOf(subjects[i]) !== -1) {
                    this.group_session.players[index].role.revealed = true;
                    let text = "🎩 " + players[index].name;
                    text += " telah mengungkapkan dirinya sebagai Mayor!";

                    let flex_text = {
                      headerText: "📜 Info",
                      bodyText: text
                    };

                    return replyFlex(flex_text);
                  }
                }
              }
            }
          }
        }
      } else {
        let playersLength = this.group_session.players.length;

        if (playersLength < 5) {
          if (time <= 50 && time > 0) {
            let reminder = "💡 Waktu tersisa " + time;
            reminder +=
              " detik lagi. Jika tidak ada yang join, game akan dihentikan";
            return replyText(reminder);
          }
        }
      }
    }
    return Promise.resolve(null);
  }

  let input = args[0].toLowerCase();
  switch (input) {
    case "/new":
    case "/buat":
    case "/main":
    case "/play":
      return newCommand();
    case "/join":
    case "/j":
      return joinCommand();
    case "/cancel":
    case "/out":
    case "/quit":
    case "/keluar":
    case "/left":
      return cancelCommand();
    case "/start":
    case "/mulai":
    case "/gas":
    case "/anjing":
      return startCommand();
    case "/stop":
      return stopCommand();
    case "/cmd":
      return commandCommand();
    case "/help":
      return helpCommand();
    case "/gamestat":
      return gameStatCommand();
    case "/players":
    case "/player":
    case "/pemain":
    case "/p":
      return playersCommand();
    case "/check":
    case "/cek":
    case "/c":
    case "/cok":
      return checkCommand();
    case "/vote":
      return voteCommand();
    case "/about":
      return aboutCommand();
    case "/status":
      return statusCommand();
    case "/info":
      return infoCommand();
    case "/roles":
    case "/rolelist":
      return roleListCommand();
    case "/tutorial":
      return tutorialCommand();
    case "/role":
    case "/news":
      return personalCommand();
    case "/skip":
      if (this.user_session.id === process.env.DEV_ID) {
        this.group_session.time = 0;
        checkCommand();
      } else {
        return invalidCommand();
      }
      break;
    case "/revoke":
      return revokeCommand();
    case "/extend":
      return extendCommand();
    case "/kick":
      return kickCommand();
    case "/set":
    case "/setting":
      return settingCommand();
    case "/skill":
      return skillCommand();
    case "/forum":
    case "/oc":
    case "/openchat":
      return forumCommand();
    case "/update":
    case "/updates":
      return showUpdatesCommand();
    default:
      return invalidCommand();
  }
};

/// TODO : untuk commands, isi dulu yang static, baru settings, terakhir baru lah logic game

const settingCommand = () => {
  const state = this.group_session.state;
  if (state !== "idle" && state !== "new") {
    let text = "💡 " + this.user_session.name;
    text += ", setting hanya bisa di atur saat game belum berjalan";
    return replyText(text);
  }

  return setting.receive(
    this.event,
    this.args,
    this.rawArgs,
    this.group_sessions,
    this.user_sessions
  );
};

const commandCommand = () => {
  const flex_texts = [];
  let firstText = "";
  let secondText = "";
  const cmds = [
    "/new : main game",
    "/cancel : keluar game",
    "/join : join game",
    "/players : cek list pemain",
    "/stop : stop game",
    "/start : start game",
    "/info : tampilin list role",
    "/about : tentang bot",
    "/revoke : untuk batal voting",
    "/extend : untuk menambah 1 menit saat baru membuat room game",
    "/kick : untuk mengeluarkan bot dari group atau room chat",
    "/setting : untuk melihat pengaturan game",
    "/tutorial : tutorial menggunakan bot ini",
    "/gamestat : status game yang berjalan di grup ini",
    "/forum : link ke openchat",
    "/updates : untuk melihat 5 update terakhir bot"
  ];

  for (let i = 0; i < cmds.length; i++) {
    if (i > 7) {
      secondText += "- " + cmds[i] + "\n";
    } else {
      firstText += "- " + cmds[i] + "\n";
    }
  }

  for (let i = 0; i < 2; i++) {
    let flex_text = {
      headerText: "📚 Daftar Perintah",
      bodyText: ""
    };

    if (i === 0) {
      flex_text.bodyText = firstText;
    } else {
      flex_text.bodyText = secondText;
    }

    flex_texts.push(flex_text);
  }

  return replyFlex(flex_texts);
};

const helpCommand = () => {
  const state = this.group_session.state;
  const flex_text = util.getHelp(state);
  return replyFlex(flex_text);
};

const statusCommand = () => {
  const msg = stats.statusCommand(this.user_sessions, this.group_sessions);
  return replyFlex(msg);
};

const infoCommand = () => {
  info.receive(this.event, this.args);
};

const tutorialCommand = () => {
  const msg = util.getTutorial();
  return replyFlex(msg);
};

const aboutCommand = () => {
  const flex_text = util.getAbout();
  return replyFlex(flex_text);
};

const personalCommand = () => {
  const text = `💡 ${this.user_session.name}, commad ${
    this.args[0]
  } hanya boleh dilakukan di pc bot`;
  return replyText(text);
};

const forumCommand = () => {
  const msg = util.getForumInfo();
  return replyFlex(msg);
};

const showUpdatesCommand = () => {
  const updates = util.getUpdates();
  return replyFlex(updates);
};

const invalidCommand = () => {
  const text = `💡 Tidak ditemukan perintah '${
    this.args[0]
  }'. Cek daftar perintah yang ada di '/cmd'`;
  return replyText(text);
};

/** helper func **/

const indexOfPlayer = () => {
  for (let i = 0; i < this.group_session.players.length; i++) {
    if (this.group_session.players[i].id === this.user_session.id) {
      return i;
    }
  }
  return -1;
};

/** message func **/

const replyText = texts => {
  let state = this.group_session.state;
  texts = Array.isArray(texts) ? texts : [texts];

  let sender = {};

  if (state !== "idle" && state !== "new") {
    sender = {
      name: "Moderator",
      iconUrl:
        "https://cdn.glitch.com/fc7de31a-faeb-4c50-8a38-834ec153f590%2F%E2%80%94Pngtree%E2%80%94microphone%20vector%20icon_3725450.png?v=1587456628843"
    };
  } else {
    sender = util.getSender();
  }

  let msg = texts.map(text => {
    return {
      sender,
      type: "text",
      text: text.trim()
    };
  });

  return client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log("err di replyText di main.js", err.originalError.response.data);
  });
};

const replyFlex = flex_raw => {
  let state = this.group_session.state;
  let opt_text = null;
  let sender = {};

  if (state !== "idle" && state !== "new") {
    sender = {
      name: "Moderator",
      iconUrl:
        "https://cdn.glitch.com/fc7de31a-faeb-4c50-8a38-834ec153f590%2F%E2%80%94Pngtree%E2%80%94microphone%20vector%20icon_3725450.png?v=1587456628843"
    };

    const time = this.group_session.time;
    if (time < 15) {
      let reminder = "💡 ";

      if (time < 1) {
        reminder += "Waktu sudah habis, ketik '/cek' untuk lanjutkan proses";
      } else {
        reminder +=
          "Waktu tersisa " +
          time +
          " detik lagi, nanti ketik '/cek' untuk lanjutkan proses";
      }

      opt_text = {
        type: "text",
        text: reminder
      };
    }
  } else {
    sender = util.getSender();
  }

  const msg = flex.build(flex_raw, sender, opt_text);
  return client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log(JSON.stringify(msg));
    console.error(
      "err replyFlex di main.js",
      err.originalError.response.data.message
    );
  });
};

module.exports = {
  receive
};
