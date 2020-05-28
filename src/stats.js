const fs = require("fs");
const baseUserPath = "/app/.data/users/";
const database = require("/app/src/database");
const helper = require("/app/helper");

// const datas = require("/app/src/data");

module.exports = {
  receive: function(client, event, args) {
    this.client = client;
    this.event = event;
    this.args = args;

    switch (this.args[0]) {
      case "/status":
        // game online ada berapa
        return this.statusCommand();
    }
  },

  statusCommand: function() {
    const data = require("/app/src/data");
    let usersOnlineCount = data.getOnlineUsers();
    let groupsOnlineCount = data.getOnlineGroups();

    let statusText = "";

    let userText = "";
    if (usersOnlineCount) {
      userText = "Ada " + usersOnlineCount + " user(s) sedang online";
    } else {
      userText = "Semua user sedang offline";
    }

    let groupText = "";
    if (groupsOnlineCount) {
      groupText = "Ada " + groupsOnlineCount + " group(s) sedang online";
    } else {
      groupText = "Semua group sedang offline";
    }

    if (!groupsOnlineCount && !usersOnlineCount) {
      statusText = "Server nganggur, gak ada yang online";
    } else {
      statusText = userText + "\n\n" + groupText;
    }

    let flex_text = {
      header: {
        text: "🌐 Status"
      },
      body: {
        text: statusText
      }
    };
    return this.replyFlex(flex_text);
  },

  /* Helper Func */

  rank_sort: function(array) {
    //Thanks to
    //https://coderwall.com/p/ebqhca/javascript-sort-by-two-fields

    // descending
    return array.sort((person1, person2) => {
      let person1_winRate = person1.winRate.match(/\d+/);
      let person2_winRate = person2.winRate.match(/\d+/);
      return (
        person2.points - person1.points || person2_winRate - person1_winRate
      );
    });
  },

  getTableFlex: function(users, headerText, team) {
    let flex_text = {
      header: {
        text: headerText
      }
    };

    flex_text.table = {
      header: {
        addon: "Win Rate"
      },
      body: []
    };

    let table_body = {};

    let num = 1;
    users.forEach((item, index) => {
      table_body[index] = {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "text",
            text: ""
          },
          {
            type: "text",
            text: "",
            flex: 3
          },
          {
            type: "text",
            text: "",
            flex: 2,
            align: "center"
          },
          {
            type: "text",
            text: "",
            flex: 2,
            align: "center",
            wrap: true
          }
        ],
        margin: "sm"
      };

      table_body[index].contents[0].text += num + ".";
      table_body[index].contents[1].text += item.name;
      table_body[index].contents[2].text += item.points;
      table_body[index].contents[3].text += item.winRate;

      num++;

      flex_text.table.body.push(table_body[index]);
    });

    return flex_text;
  },

  /* Message Func */

  replyFlex: function(flex_raws, text_raws, newFlex_raws) {
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

    let newFlex_texts = null;
    if (newFlex_raws) {
      newFlex_raws = Array.isArray(newFlex_raws)
        ? newFlex_raws
        : [newFlex_raws];
      newFlex_texts = newFlex_raws.map(newFlex_raw => ({
        header: newFlex_raw.header,
        body: newFlex_raw.body,
        footer: newFlex_raw.footer,
        table: newFlex_raw.table
      }));
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
      newFlex_texts,
      "stat",
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
        "err di replyText di stats.js",
        err.originalError.response.data
      );
    });
  }
};
