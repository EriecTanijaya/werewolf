const client = require("./client");
const util = require("../util");
const flex = require("../message/flex");
const rawRoles = require("../roles");
const modes = require("../modes");

const receive = (event, args, rawArgs, group_sessions, user_sessions) => {
  this.event = event;
  this.group_sessions = group_sessions;
  this.user_sessions = user_sessions;
  this.user_session = user_sessions[event.source.userId];
  const groupId = util.getGroupId(event);
  this.group_session = group_sessions[groupId];
  this.rawArgs = rawArgs.trim();
  this.args = args.map(item => {
    return item.toLowerCase();
  });

  if (!args[1]) {
    return commandCommand();
  }

  switch (args[1]) {
    case "mode":
      return setModeCommand();
    case "show_role":
      return setShowRoleCommand();
    case "role":
      return setRoleCommand();
    default:
      return invalidCommand();
  }
};

const setModeCommand = () => {
  const modeList = Object.keys(modes);
  let found = false;

  if (!this.args[2]) {
    let list = modeList.join(", ");
    let text = "📜 Mode List : " + "\n";
    text += list + "\n\n";
    text += "Cth: Untuk set mode bisa ketik '/set mode chaos";
    return replyText(text);
  }

  if (this.args[2] === "random") {
    let randomMode = util.random(modeList);
    if (randomMode === "custom") randomMode = "classic";

    this.group_session.mode = randomMode;
    return replyText("🎲 Game mode di ubah ke " + randomMode + " secara random!");
  }

  if (this.args[2] === "custom") {
    let text = "📜 Untuk set custom role contohnya seperti ini : " + "\n";
    text += "'/set role mafioso sheriff serial-killer bodyguard'" + "\n\n";
    text += "💡 Setiap role dipisahkan dengan spasi";
    return replyText(text);
  }

  for (let i = 0; i < modeList.length; i++) {
    const { id, name } = modes[modeList[i]].getData();
    if (this.args[2] === modeList[i] || this.args[2] == id) {
      found = true;
      if (this.group_session.mode === name) {
        let text = "💡 " + this.user_session.name + ", ";
        text += "game mode nya sudah di set ke " + name;
        return replyText(text);
      } else {
        this.group_session.mode = modeList[i];
        return replyText("🕹️ Game mode berhasil diubah ke " + name + "!");
      }
    }
  }

  if (!found) {
    let text = "💡 Tidak ditemukan mode " + this.args[2] + ". ";
    text += "Lihat daftar mode dengan '/info mode'";
    return replyText(text);
  }
};

const setShowRoleCommand = () => {
  if (!this.args[2]) {
    const text = "📜 Jika show_role no, maka tidak bisa akses cmd '/roles' pada game. Tidak berlaku pada mode custom.";
    return replyText(text);
  }

  const input = this.args[2].toLowerCase();

  let text = "✉️ ";
  if (input === "yes" || input === "y") {
    this.group_session.isShowRole = true;
    text += "Show role diaktifkan!";
  } else if (input === "no" || input === "n") {
    if (this.group_session.mode === "custom") {
      return replyText("💡 Mode custom tidak dapat hide role list pada game!");
    }

    this.group_session.isShowRole = false;
    text += "Show role di non-aktifkan!";
  } else {
    return replyText("💡 Gunakan /set show_role yes atau no");
  }

  return replyText(text);
};

const setRoleCommand = () => {
  if (!this.args[2]) {
    let text = "📜 Untuk set custom role contohnya seperti ini : " + "\n";
    text += "'/set role mafioso sheriff serial-killer bodyguard'" + "\n\n";
    text += "💡 Setiap role dipisahkan dengan spasi";
    return replyText(text);
  }

  if (this.group_session.state === "idle") {
    return replyText("💡 Belum ada game yang dibuat, ketik '/new' untuk buat game baru");
  }

  if (this.group_session.roomHostId !== this.user_session.id) {
    return replyText("💡 Hanya pembuat room game saja yang bisa atur Custom Role!");
  }

  this.args.splice(0, 2);

  const customRoles = this.args.map(item => {
    return item.toLowerCase();
  });

  const errors = [];

  // check unknown role
  const knownRoleNames = Object.keys(rawRoles);

  customRoles.forEach(item => {
    if (!knownRoleNames.includes(item)) {
      errors.push(`💡 Tidak ditemukan '${item}' pada daftar role`);
    }
  });

  // check needed team
  const knownRoles = Object.keys(rawRoles).map(item => {
    const { name, team } = rawRoles[item].getData();
    return { name, team };
  });

  const teams = [];
  const neutrals = ["executioner", "jester", "survivor", "amnesiac", "guardian-angel"];
  let allTeamsCount = 0; //without neutrals

  for (let i = 0; i < customRoles.length; i++) {
    for (let u = 0; u < knownRoles.length; u++) {
      const knownRoleName = knownRoles[u].name;
      if (knownRoleName === customRoles[i]) {
        if (neutrals.includes(customRoles[i])) {
          continue;
        }

        allTeamsCount++;
        if (!teams.includes(knownRoles[u].team)) {
          teams.push(knownRoles[u].team);
        }
      }
    }
  }

  if (teams.length < 2) {
    errors.push("💡 Masukkan minimal 2 team yang berlawanan dalam 1 game.");
  } else {
    if (teams.length === 2 && allTeamsCount === 2) {
      errors.push(`💡 Jumlah team ${teams[0]} dan ${teams[1]} terlalu sedikit, disarankan tambah 1 team baru lagi`);
    }
  }

  // check special role
  function has(roleName) {
    for (let i = 0; i < customRoles.length; i++) {
      if (customRoles[i] === roleName) {
        return true;
      }
    }
    return false;
  }

  function hasVillager() {
    for (let i = 0; i < teams.length; i++) {
      if (teams[i] === "villager") {
        return true;
      }
    }
    return false;
  }

  // executioner
  if (has("executioner") && !hasVillager()) {
    errors.push("💡 Masukkan setidaknya 1 warga jika ingin menggunakan role Executioner");
  }

  // vampire hunter
  if (has("vampire-hunter")) {
    let hasVampire = false;
    for (let i = 0; i < teams.length; i++) {
      if (teams[i] === "vampire") {
        hasVampire = true;
        break;
      }
    }

    if (!hasVampire) {
      errors.push("💡 Masukkan role Vampire jika ingin menggunakan role Vampire Hunter");
    }
  }

  // sheriff
  if (has("sheriff")) {
    const suspiciousList = ["mafioso", "consigliere", "consort", "serial-killer", "framer", "disguiser", "werewolf"];

    let isSomeoneSuspicious = false;
    for (let i = 0; i < customRoles.length; i++) {
      if (suspiciousList.includes(customRoles[i])) {
        isSomeoneSuspicious = true;
        break;
      }
    }

    if (!isSomeoneSuspicious) {
      errors.push(
        "💡 Masukkan setidaknya role yang bisa dicek bersalah oleh role Sheriff, yaitu anggota Mafia (selain Godfather) atau Serial Killer"
      );
    }
  }

  // retributionist
  if (has("retributionist") && !hasVillager()) {
    errors.push("💡 Masukkan setidaknya 1 warga jika ingin menggunakan role Retributionist");
  }

  // framer
  if (has("framer")) {
    let townInvestigate = ["sheriff", "investigator"];

    let hasTownInvestigate = false;
    for (let i = 0; i < customRoles.length; i++) {
      if (townInvestigate.includes(customRoles[i])) {
        hasTownInvestigate = true;
        break;
      }
    }

    if (!hasTownInvestigate) {
      errors.push("Masukkan setidaknya role Sheriff dan/atau Investigator agar Framer berguna!");
    }
  }

  // check duplicate special role

  // thanks to
  // https://stackoverflow.com/questions/40305789/check-if-element-is-in-array-twice-time
  function countInArray(what) {
    return customRoles.filter(item => item == what).length;
  }

  let uniqRole = ["plaguebearer", "veteran", "mayor"];

  uniqRole.forEach(item => {
    if (countInArray(item) > 1) {
      errors.push(`💡 Role ${item} hanya boleh 1 saja`);
    }
  });

  // kasih tau kesalahan
  if (errors.length > 0) {
    let text = errors.join("\n");

    text += "\n\n📜 Cek list role yang ada di bot ini dengan '/info role'\n";

    return replyText(text);
  }

  this.group_session.customRoles = customRoles;
  this.group_session.mode = "custom";

  let text = "📜 Roles : " + customRoles.join(", ") + "\n\n";
  text += "💡 Untuk menggunakan mode yang lain bisa dengan cmd '/set mode'";

  if (!this.group_session.isShowRole) {
    this.group_session.isShowRole = true;
    text += "\n\n" + "💡 Karena ini mode custom, role nya akan ditampilkan";
  }

  let flex_text = {
    headerText: "📣 Custom Roles Set!",
    bodyText: text
  };

  return replyFlex(flex_text);
};

const commandCommand = () => {
  let text = "";

  const cmds = [
    "/set mode : untuk lihat mode game yang ada",
    "/set mode <nama mode> : untuk set ke mode yang diinginkan",
    "/set mode random : untuk set game mode secara random",
    "/set show_role <yes/no> : untuk set apakah ingin tampilkan list tipe role yang ada di suatu game",
    "/set role : untuk set custom role"
  ];

  cmds.forEach(item => {
    text += "- " + item + "\n";
  });

  const flex_text = {
    headerText: "⚙️ Daftar Perintah",
    bodyText: text
  };
  return replyFlex(flex_text);
};

const invalidCommand = () => {
  let text = "💡 Tidak ada command " + this.args[1] + ". ";
  text += "Cek daftar command dengan ketik '/set'";
  return replyText(text);
};

/** message func **/

const replyText = async texts => {
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

  await client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log("err di replyText di setting.js", err.originalError.response.data);
  });
};

const replyFlex = async flex_raw => {
  const sender = {
    name: "Moderator",
    iconUrl:
      "https://cdn.glitch.com/fc7de31a-faeb-4c50-8a38-834ec153f590%2F%E2%80%94Pngtree%E2%80%94microphone%20vector%20icon_3725450.png?v=1587456628843"
  };

  const msg = flex.build(flex_raw, sender);
  await client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log(JSON.stringify(msg));
    console.error("err replyFlex di setting.js", err.originalError.response.data.message);
  });
};

module.exports = {
  receive
};
