const client = require("./client");

const flex = require("../message/flex");

const util = require("../util");

const roles = require("../roles");
const modes = require("../modes");
const types = require("../types");

const receive = (event, args, groupState = null) => {
  this.event = event;
  this.args = args;

  if (!args[1]) {
    return commandCommand();
  }

  let input = this.args[1].toLowerCase();
  if (input === "role") {
    return roleListCommand();
  } else if (input === "mode") {
    return modeListCommand();
  } else if (input === "type") {
    return typeListCommand();
  }

  if (this.args[2]) {
    this.args.shift();
    input = this.args.join("-");
  }

  const flex_text = {
    headerText: "",
    bodyText: ""
  };

  if (roles[input] !== undefined) {
    const role = roles[input];
    const { name, team, type, emoji, iconUrl } = role.getData();
    const text = role.getInfo();

    const goodName = name[0].toUpperCase() + name.substring(1);

    flex_text.headerText = `${emoji.self} ${goodName}`;
    flex_text.bodyText = `Type : ${type}\n\n${text}`;
  } else if (modes[input] !== undefined) {
    const mode = modes[input];

    const { id, name, isShowRole, description } = mode.getData();

    flex_text.headerText = name;
    flex_text.bodyText = `${description}`;

    if (groupState === "new" || groupState === "idle") {
      flex_text.buttons = [
        {
          action: "postback",
          label: "set mode ini",
          data: `/set mode ${id}`
        }
      ];
    }
  } else if (types[input] !== undefined) {
    flex_text.headerText = types[input].name;
    flex_text.bodyText = types[input].list;
  } else {
    return invalidCommand();
  }

  return replyFlex(flex_text);
};

const invalidCommand = () => {
  let text = `💡 Tidak ditemukan '${
    this.args[1]
  }', apakah itu role, mode atau types? `;
  text += `Cek '/info' untuk detail nya`;
  return replyText(text);
};

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
  const sender = util.getSender();

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
