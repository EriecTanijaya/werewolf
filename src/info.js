const client = require("./client");
const flex = require("../message/flex");
const util = require("../util");
const roles = require("../roles");
const modes = require("../modes");
const types = require("../types");
const addonInfo = require("../addonInfo");

const receive = (event, args, rawArgs, groupState = null) => {
  this.event = event;
  this.rawArgs = rawArgs.trim();
  this.args = args.map(item => {
    return item.toLowerCase();
  });

  if (!this.args[1]) {
    return commandCommand();
  }

  let input = args[1].toLowerCase();

  if (input === "role") {
    return roleListCommand();
  } else if (input === "mode") {
    return modeListCommand();
  } else if (input === "type") {
    return typeListCommand();
  } else if (input === "lain") {
    return addonInfoCommand();
  }

  if (this.args[2]) {
    this.args.shift();
    input = this.args.join("-");
  }

  if (!roles[input] && !modes[input] && !types[input] && !addonInfo[input]) {
    return invalidCommand();
  }

  const flex_texts = [];

  if (roles[input] !== undefined) {
    const role = roles[input];
    const { name, type, emoji } = role.getData();
    const text = role.getInfo();

    const goodName = name[0].toUpperCase() + name.substring(1);

    const flex_text = {
      headerText: `${emoji.self} ${goodName}`,
      bodyText: `Type : ${type}\n\n${text}`
    };

    flex_texts.push(flex_text);
  }

  if (modes[input] !== undefined) {
    const mode = modes[input];

    const { id, name, description } = mode.getData();

    const flex_text = {
      headerText: `${name} Mode`,
      bodyText: `${description}`
    };

    if (groupState === "new" || groupState === "idle") {
      flex_text.buttons = [
        {
          action: "postback",
          label: "👆 set mode ini",
          data: `/set mode ${id}`
        }
      ];
    }

    flex_texts.push(flex_text);
  }

  if (types[input] !== undefined) {
    const flex_text = {
      headerText: types[input].name,
      bodyText: types[input].list
    };

    flex_texts.push(flex_text);
  }

  if (addonInfo[input] !== undefined) {
    const { headerText, bodyText } = addonInfo[input];
    const flex_text = { headerText, bodyText };
    flex_texts.push(flex_text);
  }

  return replyFlex(flex_texts);
};

const modeListCommand = () => {
  const modeList = Object.keys(modes);
  const text = "\n\n📜 Ex: Ketik '/info vip' untuk detail mode VIP";
  const flex_text = {
    headerText: "💪 Mode List 🧛",
    bodyText: modeList.join(", ") + text
  };
  return replyFlex(flex_text);
};

const typeListCommand = () => {
  const typeList = Object.keys(types);
  const text = "\n\n📜 Ex: Ketik '/info town investigate' untuk daftar role pada tipe Town Investigate";
  const flex_text = {
    headerText: "👨‍🌾 Type List 🤵",
    bodyText: typeList.join(", ") + text
  };
  return replyFlex(flex_text);
};

const roleListCommand = () => {
  const roleList = Object.keys(roles);
  const text = "\n\n📜 Ex: Ketik '/info villager' untuk detail role Villager";
  const flex_text = {
    headerText: "✒️ Role List 🕵️",
    bodyText: roleList.join(", ") + text
  };
  return replyFlex(flex_text);
};

const addonInfoCommand = () => {
  const addonInfoList = Object.keys(addonInfo);
  const flex_text = {
    headerText: "📜 Addon Info",
    bodyText: addonInfoList.join(", ")
  };
  return replyFlex(flex_text);
};

const invalidCommand = () => {
  let text = `💡 Tidak ditemukan '${this.args[1]}', apakah itu role, mode atau types? `;
  text += "Cek '/info' untuk detail nya";
  return replyText(text);
};

const commandCommand = () => {
  let text = "";
  const cmds = [
    "/info :  tampilin list command info",
    "/info role : list role yang ada",
    "/info type : list type yang ada",
    "/info mode : list mode yang ada",
    "/info <nama-role> : deskripsi role tersebut",
    "/info <nama-type> : deskripsi role tersebut",
    "/info mode <nama-mode> : deskripsi mode tersebut",
    "/info lain : info tambahan"
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

  return client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log("err di replyText di info.js", err.originalError.response.data);
  });
};

const replyFlex = flex_raw => {
  const sender = {
    name: "Moderator",
    iconUrl:
      "https://cdn.glitch.com/fc7de31a-faeb-4c50-8a38-834ec153f590%2F%E2%80%94Pngtree%E2%80%94microphone%20vector%20icon_3725450.png?v=1587456628843"
  };

  const msg = flex.build(flex_raw, sender);
  return client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log(JSON.stringify(msg));
    console.error("err replyFlex di info.js", err.originalError.response.data.message);
  });
};

module.exports = {
  receive
};
