const helper = require("/app/helper");
const rolesData = require("/app/roles/rolesData");
const flex = require("/app/message/flex");

module.exports = {
  receive: function(client, event, args) {
    this.client = client;
    this.event = event;
    this.args = args;

    const data = require("/app/src/data");
    let usersData = data.getOnlineUsers();
    let groupsData = data.getOnlineGroups();

    switch (this.args[0]) {
      case "/status":
        return this.statusCommand(usersData, groupsData);
      case "/groups":
        return this.groupsListCommand(groupsData);
      case "/users":
        return this.usersListCommand(usersData);
    }
  },

  groupsListCommand: async function(groupsData) {
    if (!groupsData.length) return this.replyText("ga ada group yang online");

    let text = `Groups (${groupsData.length}) : \n`;
    let num = 1;
    groupsData.forEach(item => {
      let name = item.name;

      if (!name) {
        let shortRoomId = item.groupId.substr(item.groupId.length - 4);
        name = "Room " + shortRoomId;
      }

      text += `${num}. ${name} (${item.players.length})\n`;
      num++;
    });
    text = text.trim();
    return this.replyText(text);
  },

  usersListCommand: async function(usersData) {
    if (!usersData.length) return this.replyText("ga ada user yang online");
    
    let text = `Users (${usersData.length}) : \n`;
    let num = 1;
    usersData.forEach(item => {
      text += `${num}. ${item.name} (${item.groupName})\n`;
      num++;
    });
    text = text.trim();
    return this.replyText(text);
  },

  statusCommand: function(usersData, groupsData) {
    let usersOnlineCount = usersData.length;
    let groupsOnlineCount = groupsData.length;

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

    let roles = rolesData.map(role => {
      let roleName = role.name[0].toUpperCase() + role.name.substring(1);
      return {
        name: roleName,
        iconUrl: role.iconUrl
      };
    });

    let role = helper.random(roles);

    sender.name = role.name;
    sender.iconUrl = role.iconUrl;

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

    let roles = rolesData.map(role => {
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
