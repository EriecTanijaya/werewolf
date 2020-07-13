const client = require("./client");
const util = require("../util");
const attackedMsg = require("../message/attack");
const peaceMsg = require("../message/peace");
const punishment = require("../message/punishment");
const flex = require("../message/flex");
const setting = require("../src/setting");
const helpFlex = require("../message/help");
const stats = require("./stats");

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
    let state = this.group_session.state;

    if (state !== "idle") {
      if (state !== "new") {
        if (time <= 10 && time > 0) {
          let reminder = "💡 Waktu tersisa " + time;
          reminder += " detik lagi, nanti ketik '/cek' ";
          reminder += "saat waktu sudah habis untuk lanjutkan proses. ";
          return replyText(reminder);
        } else if (time === 0) {
          if (this.indexOfPlayer() !== -1) {
            return this.checkCommand();
          }
        }

        // special role yang bisa trigger lewat text biasa
        let players = this.group_session.players;
        let index = this.indexOfPlayer();
        if (index !== -1) {
          if (state === "day" || state === "vote") {
            let roleName = players[index].role.name;
            if (roleName === "mayor" && players[index].status === "alive") {
              if (players[index].role.revealed) return Promise.resolve(null);
              let string = this.args.join(" ");
              string = string.toLowerCase();
              if (string.includes("mayor")) {
                let subjects = ["aku", "ak", "gw", "gue", "gua", "saya"];

                for (let i = 0; i < subjects.length; i++) {
                  if (string.indexOf(subjects[i]) !== -1) {
                    this.group_session.players[index].role.revealed = true;
                    let text = "🎩 " + players[index].name;
                    text += " telah mengungkapkan dirinya sebagai Mayor!";

                    let flex_text = {
                      header: {
                        text: "📜 Info"
                      },
                      body: {
                        text: text
                      }
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
      return statCommand();
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

/** helper func **/

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
    console.log("err di replyText di idle.js", err.originalError.response.data);
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
      "err replyFlex di idle.js",
      err.originalError.response.data.message
    );
  });
};

module.exports = {
  receive
}