const client = require("./client");

const flex = require("../message/flex");

const util = require("../util");

const roles = require("../roles_wip");

const receive = (event, args) => {
  this.event = event;
  this.args = args;
  
  if (!args[1]) {
    return commandCommand();
  }
  
  return invalidCommand()

  let input = this.args[1].toLowerCase();
  if (input === "role") {
    return roleListCommand();
  } else if (input === "mode") {
    return modeListCommand();
  } else if (input === "type") {
    return typeListCommand();
  }

  // search thru all shit
  if (roles[input] !== undefined) {
    const role = roles[input];
    const { name, team, type, emoji, iconUrl } = role.getData();
    const text = role.getInfo();

    const goodName = name[0].toUpperCase() + name.substring(1);

    const flex_text = {
      headerText: `${emoji.self} ${goodName}`,
      bodyText: `Type : ${type}\n\n${text}`
    };

    return replyFlex(flex_text);
  } else if (modes[input] !== undefined) {
    
  } else if (types[input] !== undefined) {
    
  } else {
    return invalidCommand();
  }
};

const invalidCommand = () => {
  let text = `💡 Tidak ditemukan '${this.args[1]}', apakah itu role, mode atau types? `;
  text += `Cek '/info' untuk detail nya`;
  return replyText(text);
}

const commandCommand = () => {
  const text = "";
  const cmds = [
    "/info :  tampilin list command info",
    "/info role : list role yang ada",
    "/info type : list type yang ada",
    "/info mode : list mode yang ada",
    "/info <nama-role> : deskripsi role tersebut",
    "/info <nama-type> : deskripsi role tersebut",
    "/info mode <nama-mode> : deskripsi mode tersebut"
  ];

  cmds.forEach(item => {
    text += "- " + item + "\n";
  });

  const flex_text = {
    headerText: "📚 Daftar Perintah Info",
    bodyText: text
  };

  return replyFlex(flex_text);
};

/** message func **/

const replyText = texts => {
  texts = Array.isArray(texts) ? texts : [texts];

  const sender = util.getSender();

  let msg = texts.map(text => {
    return {
      sender,
      type: "text",
      text: text.trim()
    };
  });

  return client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log("err di replyText di info.js", err.originalError.response.data);
  });
};

const replyFlex = flex_raw => {
  const rolesData = require("../roles/rolesData");
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
      "err replyFlex di info.js",
      err.originalError.response.data.message
    );
  });
};

module.exports = {
  receive
};
