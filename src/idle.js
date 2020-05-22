const helper = require("/app/helper");

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

    let input = this.args[0].toLowerCase();
    switch (input) {
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
      case "/tutorial":
        return this.tutorialCommand();
      case "/forum":
      case "/oc":
      case "/openchat":
        return this.forumCommand();
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
  
  forumCommand: function() {
    let flex_text = {
      header: {
        text: "💬 Forum"
      },
      body: {
        text: "Gabung ke forum untuk tahu berita tentang bot!"
      },
      footer: {
        buttons: [
          {
            action: "uri",
            label: "open forum",
            data:
              "https://line.me/ti/g2/3NEqw4h7jNdOBCur8AQWyw?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
          }
        ]
      }
    };
    return this.replyFlex(flex_text);
  },

  tutorialCommand: function() {
    let flex_text = helper.getTutorial();
    return this.replyFlex(flex_text);
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
    let flex_text = helper.getAbout();
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
      "/rank : cek rank",
      "/tutorial : tutorial menggunakan bot ini",
      "/forum : link ke openchat",
      "/status : untuk melihat berapa yang online"
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
    const invalid = require("/app/message/invalid");
    let text = invalid.getResponse(this.args, this.user_session.name);
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

    let sender = {
      name: "",
      iconUrl: ""
    };

    let roles = require("/app/roles/rolesData").map(role => {
      let roleName = role.name[0].toUpperCase() + role.name.substring(1);
      return {
        name: roleName,
        iconUrl: role.iconUrl
      };
    });

    let role = helper.random(roles);

    sender.name = role.name;
    sender.iconUrl = role.iconUrl;

    const flex = require("/app/message/flex");
    return flex.receive(
      this.client,
      this.event,
      flex_texts,
      opt_texts,
      null,
      null,
      sender
    );
  },

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];

    let sender = {
      name: "",
      iconUrl: ""
    };

    let roles = require("/app/roles/rolesData").map(role => {
      let roleName = role.name[0].toUpperCase() + role.name.substring(1);
      return {
        name: roleName,
        iconUrl: role.iconUrl
      };
    });

    let role = helper.random(roles);

    sender.name = role.name;
    sender.iconUrl = role.iconUrl;

    let msg = texts.map(text => {
      return {
        sender: sender,
        type: "text",
        text: text.trim()
      };
    });

    return this.client.replyMessage(this.event.replyToken, msg).catch(err => {
      console.log(
        "err di replyText di idle.js",
        err.originalError.response.data
      );
    });
  }
};
