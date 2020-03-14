module.exports = {
  receive: function(client, event, args, rawArgs, user_session) {
    this.client = client;
    this.event = event;
    this.args = args;
    this.rawArgs = rawArgs;
    this.user_session = user_session;

    if (!this.rawArgs.startsWith("/")) {
      return Promise.resolve(null);
    }

    switch (this.args[0]) {
      case "/help":
        return this.helpCommand();
      case "/cmd":
        return this.commandCommand();
      case "/about":
        return this.aboutCommand();
      case "/info":
      case "/rolelist":
        return this.infoCommand();
      case "/rank":
      case "/me":
      case "/status":
      case "/stat":
      case "/stats":
      case "/reset":
        return this.statCommand();
      case "/role":
      case "/news":
      case "/jurnal":
      case "/r":
      case "/c":
      case "/skill":
        return this.notInGameCommand();
      default:
        return this.invalidCommand();
    }
  },

  statCommand: function() {
    const stats = require("/app/src/stats");
    stats.receive(this.client, this.event, this.args);
  },

  notInGameCommand: function() {
    let text = "💡 Kamu tidak ada join kedalam game";
    return this.replyText(text);
  },

  aboutCommand: function() {
    let text = "Bot semi automatic yang ada campuran elemen dari ";
    text += "Town Of Salem.";
    text +=
      "Thanks buat grup Avalon City, LOW, Where Wolf(?), Random dan semua adders!" +
      "\n";
    text += "- Eriec (creator)";
    let flex_text = {
      header: {
        text: "🐺 Werewolf 🧑‍🌾"
      },
      body: {
        text: text
      }
    };
    return this.replyFlex(flex_text);
  },

  infoCommand: function() {
    const roles = require("/app/roles/rolesInfo");
    return roles.receive(this.client, this.event, this.args);
  },

  commandCommand: function() {
    let text = "";
    let cmds = [
      "/help : bantuan game",
      "/about : tentang bot",
      "/info : list role",
      "/me : statistik user",
      "/rank : cek rank"
    ];

    cmds.forEach((item, index) => {
      text += "- " + item;
      if (index !== cmds.length - 1) {
        text += "\n";
      }
    });

    let flex_text = {
      header: {
        text: "📚 Daftar Perintah"
      },
      body: {
        text: text
      }
    };
    return this.replyFlex(flex_text);
  },

  invalidCommand: function() {
    let text =
      "💡 Perintah yang digunakan salah, ketik '/cmd' untuk list perintah";
    return this.replyText(text);
  },

  helpCommand: function() {
    const helpFlex = require("/app/message/help");
    let state = null;
    let help = helpFlex.getHelp(state);

    let flex_text = {
      header: {
        text: help.headerText
      },
      body: {
        text: help.bodyText
      }
    };

    return this.replyFlex(flex_text);
  },

  /** message func **/

  replyFlex: function(flex_raws, text_raws) {
    flex_raws = Array.isArray(flex_raws) ? flex_raws : [flex_raws];
    let flex_texts = flex_raws.map(flex_raw => ({
      header: flex_raw.header,
      body: flex_raw.body,
      footer: flex_raw.footer,
      table: flex_raw.table
    }));

    let opt_texts = [];
    if (text_raws) {
      text_raws = Array.isArray(text_raws) ? text_raws : [text_raws];
      opt_texts = text_raws.map(text => {
        return { type: "text", text: text };
      });
    }

    const flex = require("/app/message/flex");
    return flex.receive(this.client, this.event, flex_texts, opt_texts);
  },

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return this.client.replyMessage(
      this.event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  },

  /** save data func **/

  saveGroupData: function() {
    const data = require("/app/src/data");
    data.saveGroupData(this.group_session);
  },

  saveUserData: function() {
    const fs = require("fs");
    const baseUserPath = "/app/data/users/";
    let userPath = baseUserPath + this.user_session.id + "_user.json";
    var user_session = {};
    fs.readFile(userPath, "utf8", (err, data) => {
      if (err) {
        user_session = this.user_session;
      } else {
        user_session = JSON.parse(data);
      }
      this.updateUserData(user_session, this.user_session);
    });
  },

  updateUserData: function(oldUserData, newUserData) {
    // specify what necessary changes
    oldUserData.name = newUserData.name;

    const data = require("/app/src/data");
    data.saveUserData(oldUserData);
  }
};
