const client = require("./client");
const skillText = require("../message/skill");
const flex = require("../message/flex");
const util = require("../util");
const helpFlex = require("../message/help");
const stats = require("./stats");

const receive = (event, args, rawArgs, user_sessions, group_sessions) => {
  this.event = event;
  this.args = args;
  this.rawArgs = rawArgs;
  this.user_sessions = user_sessions;
  this.group_sessions = group_sessions;
  this.user_session = user_sessions[event.source.userId];
  const groupId = this.user_session.groupId;
  this.group_session = group_sessions[groupId];

  if (!rawArgs.startsWith("/")) {
    let time = this.group_session.time;

    if (this.group_session.state !== "new") {
      if (time < 15) {
        let reminder = "💡 Waktu tersisa " + time + " detik lagi";
        return replyText(reminder);
      }
    }
    return Promise.resolve(null);
  }
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
