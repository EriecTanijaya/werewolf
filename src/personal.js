const client = require("./client");
const skillText = require("../message/skill");
const respond = require("../message/respond");
const flex = require("../message/flex");
const util = require("../util");
const stats = require("./stats");
const info = require("./info");
const rawRoles = require("../roles");

const receive = (event, args, rawArgs, user_sessions, group_sessions) => {
  this.event = event;
  this.args = args;
  this.rawArgs = rawArgs;
  this.user_sessions = user_sessions;
  this.group_sessions = group_sessions;
  this.user_session = user_sessions[event.source.userId];
  const groupId = this.user_session.groupId;
  this.group_session = group_sessions[groupId];

  // reset afk if active on personal chat
  const index = indexOfPlayer();

  if (this.group_session.state !== "new") {
    if (this.group_session.players[index].afkCounter > 0) {
      this.group_session.players[index].afkCounter = 0;
    }
  }

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

  const input = args[0].toLowerCase();
  switch (input) {
    case "/role":
      return roleCommand(index);
    case "/announce":
    case "/news":
      return announceCommand(index);
    case "/help":
      return helpCommand();
    case "/cmd":
      return commandCommand();
    case "/info":
      return infoCommand();
    case "/skill":
      return targetCommand(index);
    case "/revoke":
      return revokeCommand(index);
    case "/alert":
      return alertCommand(index);
    case "/vest":
      return vestCommand(index);
    case "/protect":
      return protectCommand(index);
    case "/status":
      return statusCommand();
    case "/groups":
      return groupsListCommand();
    case "/users":
      return usersListCommand();
    case "/view":
      return viewCommand();
    case "/dnote":
    case "/dn":
      return deathNoteCommand(index);
    case "/journal":
    case "/jurnal":
      return journalCommand(index);
    case "/r":
    case "/refresh":
      return refreshCommand(index);
    case "/c":
    case "/chat":
      return chatCommand(index);
    case "/cancel":
      return cancelCommand(index);
    case "/roles":
      return roleListCommand();
    case "/update":
    case "/updates":
      return showUpdatesCommand();
    case "/run":
      return runCommand();
    case "/forum":
    case "/oc":
    case "/openchat":
      return forumCommand();
    case "/players":
    case "/p":
    case "/player":
    case "/pemain":
      return playersCommand();
    case "/tutorial":
      return tutorialCommand();
    case "/pesan":
      return sendToDevMessageCommand();
    default:
      return invalidCommand();
  }
};

const sendToDevMessageCommand = () => {
  if (this.args.length < 2) {
    return replyText("💡 Masukkan pesan untuk creator bot. Cth: /pesan pesann");
  }

  const message = util.parseToText(this.args);
  const timestamp = new Date().getTime();
  const time = new Date(timestamp).toLocaleTimeString("en-US", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit"
  });

  let text = "";
  text += `[${time}] `;
  text += `${this.user_session.name}: ${message}`;

  client
    .pushMessage(process.env.DEV_ID, { type: "text", text: text })
    .then(() => {
      return replyText("✉️ Pesanmu telah dikirim kepada creator bot!");
    })
    .catch(() => {
      this.user_session.messages.push({
        message: util.parseToText(this.args),
        timestamp: new Date().getTime()
      });

      return replyText("✉️ Pesanmu telah dikirim!");
    });
};

const tutorialCommand = () => {
  const msg = util.getTutorial();
  return replyFlex(msg);
};

const playersCommand = () => {
  const players = this.group_session.players;
  const state = this.group_session.state;
  const flex_text = util.getPlayersList(players, state);
  return replyFlex(flex_text);
};

const forumCommand = () => {
  const msg = util.getForumInfo();
  return replyFlex(msg);
};

const runCommand = () => {
  if (this.user_session.id !== process.env.DEV_ID) {
    return invalidCommand();
  }

  try {
    return eval(util.parseToText(this.args));
  } catch (err) {
    return replyText(err.message);
  }
};

const cancelCommand = index => {
  if (this.group_session.state !== "new") {
    return replyText("💡 Game sedang berjalan. ");
  }

  util.cutFromArray(this.group_session.players, index);

  let text = "💡 Kamu telah meninggalkan game. ";

  const players = this.group_session.players;
  for (let i = 0; i < players.length; i++) {
    if (this.group_session.roomHostId === this.user_session.id) {
      const randomPlayer = util.random(this.group_session.players);
      this.group_session.roomHostId = randomPlayer.id;
      text += "\n" + "👑 " + randomPlayer.name;
      text += " menjadi host baru dalam room ini. ";
      break;
    }
  }

  if (this.group_session.players.length === 0) {
    this.group_session.state = "idle";
    text += "\n" + "💡 Game di stop karena tidak ada pemain";
  }

  this.user_session.state = "inactive";
  this.user_session.groupId = "";
  this.user_session.groupName = "";
  this.user_session.time = 300;

  return replyText(text);
};

const revokeCommand = index => {
  const state = this.group_session.state;
  if (state === "new") {
    return replyText("💡 Game belum dimulai");
  }

  const players = this.group_session.players;

  if (players[index].status !== "alive") {
    let text = respond.alreadyDead(players[index].name, players[index].causeOfDeath);
    return replyText(text);
  }

  if (players[index].target.index === -1) {
    return replyText("💡 Kamu belum menggunakan skill");
  }

  this.group_session.players[index].target.index = -1;

  return replyText("💡 Kamu batal menggunakan skill");
};

const protectCommand = index => {
  const players = this.group_session.players;
  const state = this.group_session.state;

  if (state !== "night") {
    return replyText("💡 Bukan saatnya menggunakan skill");
  }

  const roleName = players[index].role.name;

  if (roleName !== "guardian-angel") {
    return replyText("💡 Role mu bukan Guardian Angel");
  }

  if (players[index].role.protection === 0) {
    return replyText("💡 Kamu sudah tidak memiliki protection yang tersisa");
  }

  const targetIndex = this.group_session.players[index].role.mustProtectIndex;

  this.group_session.players[index].target.index = targetIndex;

  let text = "";
  let msg = [];

  const doer = {
    name: players[index].name,
    roleName: roleName,
    targetName: players[targetIndex].name,
    selfTarget: false,
    changeTarget: false
  };
  text = skillText.response(doer, null);
  msg = [text];

  return replyText(msg);
};

const alertCommand = index => {
  const players = this.group_session.players;
  const state = this.group_session.state;

  if (state !== "night") {
    return replyText("💡 Bukan saatnya menggunakan skill");
  }

  const roleName = players[index].role.name;

  if (roleName !== "veteran") {
    return replyText("💡 Role mu bukan Veteran");
  }

  if (players[index].status === "death") {
    let text = respond.alreadyDead(players[index].name, players[index].causeOfDeath);
    return replyText(text);
  }

  if (players[index].role.alert === 0) {
    return replyText("💡 Kamu sudah tidak memiliki alert yang tersisa");
  }

  this.group_session.players[index].target.index = index;

  let text = "";
  let msg = [];

  const doer = {
    name: players[index].name,
    roleName: roleName,
    targetName: "",
    selfTarget: false,
    changeTarget: false
  };
  text = skillText.response(doer, null);
  msg = [text];

  if (players[index].role.canKill && players[index].deathNote === "") {
    msg.push("💡 Kamu belum buat death note, ketik /dnote <isi note kamu>");
  }

  return replyText(msg);
};

const vestCommand = index => {
  const players = this.group_session.players;
  const state = this.group_session.state;

  if (state !== "night") {
    return replyText("💡 Bukan saatnya menggunakan skill");
  }

  const roleName = players[index].role.name;

  if (roleName !== "survivor") {
    return replyText("💡 Role mu bukan Survivor");
  }

  if (players[index].status === "death") {
    let text = respond.alreadyDead(players[index].name, players[index].causeOfDeath);
    return replyText(text);
  }

  if (players[index].role.vest === 0) {
    return replyText("💡 Kamu sudah tidak memiliki Vest yang tersisa");
  }

  this.group_session.players[index].target.index = index;

  let text = "";
  let msg = [];

  const doer = {
    name: players[index].name,
    roleName: roleName,
    targetName: "",
    selfTarget: false,
    changeTarget: false
  };
  text = skillText.response(doer, null);
  msg = [text];

  return replyText(msg);
};

const targetCommand = index => {
  if (this.group_session.state === "new") {
    return replyText("💡 Game belum dimulai");
  }

  const players = this.group_session.players;
  const state = this.group_session.state;

  if (state === "day") {
    return replyText("💡 Bukan saatnya menggunakan skill");
  }

  const roleName = players[index].role.name;
  const roleTeam = players[index].role.team;

  const prohibited = ["villager", "veteran", "survivor", "executioner", "psychic", "guardian-angel"];

  if (prohibited.includes(roleName)) {
    return replyText("💡 Jangan pernah kau coba untuk");
  }

  /// special role yg bisa skill pas mati
  if (players[index].status === "death") {
    // Jester
    if (roleName !== "jester") {
      let text = respond.alreadyDead(players[index].name, players[index].causeOfDeath);
      return replyText(text);
    } else {
      if (!players[index].role.isLynched) {
        return replyText("💡 Kamu hanya bisa hantui orang jika mati digantung");
      } else if (players[index].role.hasRevenged) {
        return replyText("💡 Kamu sudah balas dendam mu kepada warga");
      }
    }
  }

  /// khusus role yang ada limited skill pas full moon
  if (!this.group_session.isFullMoon) {
    if (roleName === "werewolf") {
      return replyText("💡 Kamu hanya bisa berubah menjadi Werewolf pada bulan purnama");
    } else if (roleName === "juggernaut") {
      if (players[index].role.skillLevel === 0) {
        return replyText("💡 Kamu hanya bisa menyerang pada bulan purnama");
      }
    }
  }

  if (players[index].willSuicide) {
    return replyText("💡 Kamu sudah tak ada semangat menggunakan skill lagi");
  }

  const targetIndex = this.args[1];

  if (targetIndex === undefined) {
    return roleCommand();
  }

  /// special role with private prop for death
  if (roleName === "retributionist") {
    if (players[index].role.revive === 0) {
      return replyText("💡 Kamu hanya bisa bangkitkan orang mati 1 kali");
    }

    if (players[targetIndex].status === "alive") {
      return replyText("💡 Targetmu masih hidup");
    }

    if (players[targetIndex].role.team !== "villager") {
      if (!util.isDisguiseAsTownie(players[targetIndex])) return replyText("💡 Kamu hanya bisa bangkitin sesama warga");
    }
  } else if (roleName === "amnesiac") {
    if (players[targetIndex].status === "alive") {
      let text = "💡 Kamu hanya bisa mengingat pemain yang telah mati";
      return replyText(text);
    }
  } else {
    if (players[targetIndex].status === "death") {
      return replyText("💡 Targetmu itu dah mati. Mau di apain?");
    }
  }

  /// special role checker
  if (roleName === "vigilante") {
    if (players[index].role.bullet === 0) {
      return replyText("💡 Kamu sudah tidak memiliki peluru yang tersisa");
    }
  }

  if (targetIndex == index) {
    // hax arsonist want to ignite
    // but check is any doused player
    if (roleName === "arsonist") {
      let dousedCount = 0;
      players.forEach(item => {
        if (item.doused && item.status === "alive") {
          dousedCount++;
        }
      });
      if (!dousedCount) {
        return replyText("💡 Kamu belum bisa bakar-bakar, karena belum menyiram bensin ke siapa-siapa. ");
      }
    }

    /// role yg limited to self target
    if (roleName === "doctor") {
      if (!players[index].role.selfHeal) {
        return replyText("💡 Kamu sudah tidak bisa melindungi diri sendiri");
      }
    } else if (roleName === "bodyguard") {
      if (!players[index].role.vest) {
        return replyText("💡 Kamu sudah tidak memiliki Vest yang tersisa");
      }
    }

    if (!canSelfTarget(players[index].role)) {
      return replyText("💡 Kamu tidak bisa pilih diri sendiri di role ini");
    }
  } else {
    // pilih orang lain
    if (roleName === "arsonist") {
      if (players[targetIndex].doused) {
        return replyText("💡 Target yang kamu pilih sudah disirami bensin!");
      }
    } else if (roleName === "plaguebearer") {
      let isInfected = players[targetIndex].infected;
      let isPestilence = players[index].role.isPestilence;
      if (!isPestilence && isInfected) {
        return replyText("💡 Target yang kamu pilih sudah terinfeksi!");
      }
    }
  }

  // hax untuk doctor yang mau heal mayor
  if (roleName === "doctor") {
    let targetRoleName = players[targetIndex].role.name;
    if (targetRoleName === "mayor" && players[targetIndex].role.revealed) {
      return replyText("💡 Kamu tidak bisa heal Mayor!");
    }
  }

  if (roleName === "vampire") {
    let vampireConvertCooldown = this.group_session.vampireConvertCooldown;
    if (vampireConvertCooldown > 0) {
      let infoText = "💡 Kamu harus menunggu ";
      infoText += vampireConvertCooldown + " malam lagi untuk gigit orang";
      return replyText(infoText);
    }
  }

  if (roleName === "jester") {
    if (!players[index].role.isLynched || players[index].role.hasRevenged) {
      return replyText("💡 Jangan pernah kau coba untuk");
    }
  }

  //need system for it
  if (roleTeam === "vampire" || roleTeam === "mafia") {
    if (players[targetIndex].role.team === roleTeam) {
      return replyText("💡 Target yang kamu pilih adalah sesama team " + roleTeam);
    }
  }

  let targetName = players[targetIndex].name;

  let doer = {
    name: players[index].name,
    roleName: roleName,
    targetName: targetName,
    selfTarget: false,
    changeTarget: false
  };

  // khusus plaguebearer yang udah pestilence
  if (doer.roleName === "plaguebearer") {
    if (players[index].role.isPestilence) {
      doer.roleName = "pestilence";
    }
  }

  let playerTargetIndex = players[index].target.index;
  if (playerTargetIndex === -1) {
    if (targetIndex == index) {
      doer.selfTarget = true;
    }
  } else {
    doer.changeTarget = true;
    if (targetIndex == index) {
      doer.selfTarget = true;
    }
  }

  this.group_session.players[index].target = { index: targetIndex, value: 1 };

  if (roleName === "godfather") {
    this.group_session.players[index].target.value++;
  }

  /// Special role communication
  if (roleTeam === "mafia" || roleTeam === "vampire") {
    let text = skillText.response(doer, true);
    let message = {
      name: players[index].name,
      text: text
    };

    if (roleTeam === "mafia") {
      this.group_session.mafiaChat.push(message);
    } else if (roleTeam === "vampire") {
      this.group_session.vampireChat.push(message);
    }
  }

  let text = skillText.response(doer, null);
  let msg = [text];
  if (players[index].role.canKill && players[index].deathNote === "") {
    msg.push("💡 Kamu belum buat death note, ketik /dnote isi note kamu");
  }

  return replyText(msg);
};

const getRoleSkillText = roleName => {
  const rolesData = Object.keys(rawRoles);
  for (let i = 0; i < rolesData.length; i++) {
    if (roleName === rolesData[i]) {
      const { skillText } = rawRoles[rolesData[i]].getData();
      return skillText;
    }
  }
};

const getRoleCmdText = roleName => {
  const rolesData = Object.keys(rawRoles);
  for (let i = 0; i < rolesData.length; i++) {
    if (roleName === rolesData[i]) {
      const { cmdText } = rawRoles[rolesData[i]].getData();
      return cmdText;
    }
  }
};

const roleSkill = (flex_texts, index, text) => {
  const players = this.group_session.players;
  const role = players[index].role;

  let skillText = getRoleSkillText(role.name);
  const cmdText = getRoleCmdText(role.name);
  let isCanSelfTarget = canSelfTarget(role);

  /// special role yang bisa berubah selfTarget

  // Juggernaut yang skillLevel udah 3 keatas
  if (role.name === "juggernaut") {
    if (players[index].role.skillLevel >= 3) {
      isCanSelfTarget = true;
    }
  }

  // special role plaguebearer yang udah pestilence
  if (role.name === "plaguebearer") {
    if (players[index].role.isPestilence) {
      skillText = "Plagubearer, pilih rumah siapa yang ingin kamu serang dengan penyakit sampar!";
      isCanSelfTarget = true;
    }
  }

  flex_texts[0].bodyText += "\n\n" + skillText;
  flex_texts[0].buttons = [];

  let button = {};
  for (let i = 0; i < players.length; i++) {
    if (players[i].status === "alive") {
      if (!isCanSelfTarget && parseInt(index) === parseInt(i)) {
        continue;
      }

      /// exception on some role for their button
      if (role.team === "mafia") {
        if (players[i].role.team === "mafia") continue;
      } else if (role.team === "vampire") {
        if (players[i].role.team === "vampire") continue;
      } else if (role.name === "doctor") {
        if (players[i].role.name === "mayor" && players[i].role.revealed) {
          continue;
        }

        if (index == i && !players[i].role.selfHeal) continue;
      } else if (role.name === "bodyguard") {
        if (index == i && !players[i].role.vest) continue;
      } else if (role.name === "jester") {
        if (players[i].voteJesterIndex === -1) continue;
      }

      button[i] = {
        action: "postback",
        label: players[i].name,
        data: cmdText + " " + i
      };

      flex_texts[0].buttons.push(button[i]);
    }
  }

  if (text) {
    return replyFlex(flex_texts, text);
  } else {
    return replyFlex(flex_texts);
  }
};

const isSomeoneDeath = () => {
  const players = this.group_session.players;
  for (let i = 0; i < players.length; i++) {
    if (players[i].status === "death") {
      return true;
    }
  }
  return false;
};

const roleCommand = index => {
  if (this.group_session.state === "new") {
    return replyText("💡 Game belum dimulai");
  }

  // const index = this.args[1] !== undefined ? this.args[1] : indexOfPlayer();
  const players = this.group_session.players;
  const player = players[index];
  const state = this.group_session.state;
  const roleName = player.role.name;
  const roleTeam = player.role.team;
  const roleDesc = player.role.description;
  const goodName = roleName[0].toUpperCase() + roleName.substring(1);
  const headerText = util.getRoleNameEmoji(roleName) + " " + goodName;

  let flex_texts = [];
  let flex_text = { headerText, bodyText: "" };

  if (this.group_session.mode === "vip" && player.role.team === "villager") {
    if (this.group_session.vipIndex == index) {
      flex_text.bodyText = `⭐ Kamu adalah VIP!`;
    } else {
      flex_text.bodyText = `⭐ ${players[this.group_session.vipIndex].name} adalah VIP!`;
    }

    flex_text.bodyText += "\n\n" + roleDesc;
  } else {
    flex_text.bodyText = roleDesc;
  }

  let addon_flex_text = { headerText: "" };

  if (players[index].afkCounter > 0) {
    this.group_session.players[index].afkCounter = 0;
  }

  if (roleTeam === "mafia" || roleTeam === "vampire") {
    const teamEmoji = util.getRoleTeamEmoji(roleTeam);
    const goodName = roleTeam[0].toUpperCase() + roleTeam.substring(1);
    addon_flex_text.headerText = `${teamEmoji} ${goodName}`;

    addon_flex_text.table = {
      headers: [],
      contents: []
    };

    let num = 1;

    if (roleTeam === "mafia") {
      // untuk role team yg ada banyak role name
      addon_flex_text.table.headers.push("No.", "Name", "Role", "Status");
      players.forEach(item => {
        if (item.role.team === "mafia") {
          const table_data = [num, item.name, item.role.name, item.status];
          addon_flex_text.table.contents.push(table_data);
          num++;
        }
      });
    } else {
      // untuk role team yg nama rolenya sama semua
      addon_flex_text.table.headers.push("No.", "Name", "Status");
      players.forEach(item => {
        if (item.role.team === "vampire") {
          addon_flex_text.table.contents.push([num, item.name, item.status]);
          num++;
        }
      });
    }

    flex_texts.push(addon_flex_text);
  }

  if (player.status === "death" || player.willSuicide) {
    /// Yang bisa skill walaupun dah mati
    if (roleName !== "jester" && roleName !== "guardian-angel") {
      flex_texts.unshift(flex_text);

      let text = "";
      if (roleName === "vigilante" && player.willSuicide) {
        text += "😓 Kamu telah membunuh warga dan merasa sangat bersalah.";
      }

      return replyFlex(flex_texts, text);
    }
  }

  // special role exe
  if (roleName === "executioner") {
    const exeTarget = players[players[index].role.targetLynchIndex];
    let text = "";

    if (player.role.isTargetLynched) {
      text = "🪓 " + exeTarget.name;
      text += " sudah digantung! Sekarang tinggal sit back and relax";
    } else {
      text = "🪓 Target kamu adalah " + exeTarget.name + ". Kamu harus bisa ";
      text += "menghasut warga untuk gantung dia supaya kamu menang";
    }

    return replyFlex(flex_text, text);
  }

  // special role villager
  if (roleName === "villager") {
    let villagerCode = this.group_session.villagerCode;
    if (villagerCode !== "") {
      let text = "👨‍🌾 Kamu tidak sendirian pada kota ini! ";
      text += `✉️ Kamu mendapatkan kode '${villagerCode}' yang hanya diketahui sesama Villager. \n\n`;
      text += `💡 Ex: Disaat kamu dituduh, kamu bisa sisipkan kata '${villagerCode}' dalam argumenmu.`;
      return replyFlex(flex_text, text);
    }
  }

  if (state !== "day" && state !== "vote") {
    let text = "";
    /// Special Role Personal chat reminder
    if (roleTeam === "mafia" || roleTeam === "vampire") {
      text += "💡 Kamu bisa chat sama sesama team dengan cmd '/c <kata-yang ingin disampaikan>'" + "\n";
      text += "Gunakan cmd '/r' untuk load chat dari team";
    } else if (roleName === "vampire-hunter") {
      text += "💡 Kamu bisa dengar vampire chat-an, gunakan cmd '/r' secara berkala";
    }

    const noNightSkill = ["villager", "executioner", "mayor", "psychic"];

    if (noNightSkill.includes(roleName)) {
      return replyFlex(flex_text, text);
    }

    // morphed role message
    if (players[index].addonMessage) {
      text += players[index].addonMessage + "\n\n";
      players[index].addonMessage = "";
    }

    /// special role skill
    if (roleName === "retributionist") {
      if (player.role.revive > 0 && isSomeoneDeath()) {
        return retributionistSkill(flex_text);
      } else {
        return replyFlex(flex_text);
      }
    } else if (roleName === "veteran") {
      if (player.role.alert > 0) {
        return veteranSkill(flex_text, index);
      } else {
        return replyFlex(flex_text);
      }
    } else if (roleName === "vigilante") {
      if (player.role.isLoadBullet) {
        text += "💼 Kamu masih menyiapkan senjata mu";
        return replyFlex(flex_text, text);
      }
    } else if (roleName === "jester") {
      if (!player.role.isLynched || player.role.hasRevenged) {
        return replyFlex(flex_text);
      } else {
        text += "👻 Kamu pilih siapa saja yang ingin kamu hantui. ";
        text += "Jika tidak besok kamu akan sembarang menghantui orang";
      }
    } else if (roleName === "survivor") {
      if (player.role.vest > 0) {
        return survivorSkill(flex_text, index);
      } else {
        return replyFlex(flex_text, text);
      }
    } else if (roleName === "vampire") {
      let vampireConvertCooldown = this.group_session.vampireConvertCooldown;
      if (vampireConvertCooldown > 0) {
        let infoText = "🦇 Kamu harus menunggu " + vampireConvertCooldown + " malam untuk gigit orang";
        return replyFlex(flex_text, [text, infoText]);
      }
    } else if (roleName === "werewolf") {
      if (!this.group_session.isFullMoon) {
        text += "🌓 Masih belum bulan purnama, kamu tidur seperti biasa.";
        return replyFlex(flex_text, text);
      }
    } else if (roleName === "juggernaut") {
      let skillLevel = players[index].role.skillLevel;
      if (skillLevel === 0 && !this.group_session.isFullMoon) {
        text += "🌓 Masih belum bulan purnama, kamu tidak membunuh pada malam ini.";
        return replyFlex(flex_text, text);
      }
    } else if (roleName === "amnesiac") {
      if (isSomeoneDeath()) {
        return amnesiacSkill(flex_text);
      } else {
        return replyFlex(flex_text);
      }
    } else if (roleName === "guardian-angel") {
      if (player.role.protection > 0) {
        return guardianAngelSkill(flex_text, index);
      } else {
        return replyFlex(flex_text);
      }
    }

    // special role private role prop reminder
    if (roleName === "doctor" && players[index].role.selfHeal > 0) {
      text += "💉 Kamu memiliki " + players[index].role.selfHeal + " self heal";
    } else if (roleName === "vigilante" && players[index].role.bullet > 0) {
      text += "🔫 Kamu memiliki " + players[index].role.bullet + " peluru";
    } else if (roleName === "bodyguard" && players[index].role.vest > 0) {
      text += "🦺 Kamu memiliki " + players[index].role.vest + " vest";
    }

    // special role untuk arsonist dan plaguebearer
    if (roleName === "arsonist") {
      addon_flex_text.headerText = "🛢️ Doused List";

      addon_flex_text.table = {
        headers: [],
        contents: []
      };

      let num = 1;
      let isExists = false;
      addon_flex_text.table.headers.push("No.", "Name");
      players.forEach(item => {
        if (item.status === "alive" && item.doused) {
          isExists = true;
          const table_data = [`${num}.`, item.name];
          addon_flex_text.table.contents.push(table_data);
          num++;
        }
      });

      if (isExists) flex_texts.push(addon_flex_text);
    } else if (roleName === "plaguebearer" && !player.role.isPestilence) {
      addon_flex_text.headerText = "☣️ Infected List";

      addon_flex_text.table = {
        headers: [],
        contents: []
      };

      let num = 1;
      let isExists = false;
      addon_flex_text.table.headers.push("No.", "Name");
      players.forEach(item => {
        if (item.status === "alive" && item.infected) {
          isExists = true;
          const table_data = [`${num}.`, item.name];
          addon_flex_text.table.contents.push(table_data);
          num++;
        }
      });

      if (isExists) flex_texts.push(addon_flex_text);
    }

    flex_texts.unshift(flex_text);
    return roleSkill(flex_texts, index, text);
  } else {
    // state yang pagi tapi ga ada skill pagi
    flex_texts.unshift(flex_text);
    return replyFlex(flex_texts);
  }
};

const retributionistSkill = flex_text => {
  const skillText = getRoleSkillText("retributionist");
  const players = this.group_session.players;
  const cmdText = getRoleCmdText("retributionist");

  // check for townies only death
  let isTownieDeath = false;

  for (let i = 0; i < players.length; i++) {
    let player = players[i];
    if (player.status === "death") {
      if (player.role.team === "villager" || util.isDisguiseAsTownie(player)) {
        isTownieDeath = true;
        break;
      }
    }
  }

  if (!isTownieDeath) {
    return replyFlex(flex_text);
  }

  flex_text.bodyText += "\n\n" + skillText;
  flex_text.buttons = [];

  let button = {};
  players.forEach((item, index) => {
    if (item.status === "death") {
      if (item.role.team === "villager" || util.isDisguiseAsTownie(item)) {
        button[index] = {
          action: "postback",
          label: item.name,
          data: cmdText + " " + index
        };

        flex_text.buttons.push(button[index]);
      }
    }
  });

  return replyFlex(flex_text);
};

const amnesiacSkill = flex_text => {
  const skillText = getRoleSkillText("amnesiac");
  const players = this.group_session.players;
  const cmdText = getRoleCmdText("amnesiac");

  flex_text.bodyText += "\n\n" + skillText;

  flex_text.buttons = [];

  let button = {};
  players.forEach((item, index) => {
    if (item.status === "death") {
      button[index] = {
        action: "postback",
        label: item.name,
        data: cmdText + " " + index
      };

      flex_text.buttons.push(button[index]);
    }
  });

  return replyFlex(flex_text);
};

const guardianAngelSkill = (flex_text, index) => {
  const skillText = getRoleSkillText("guardian-angel");
  const players = this.group_session.players;
  const cmdText = getRoleCmdText("guardian-angel");

  flex_text.bodyText += "\n\n" + skillText + "\n\n";

  const targetIndex = players[index].role.mustProtectIndex;
  const targetName = players[targetIndex].name;

  flex_text.bodyText += "⚔️ Kamu bisa protect " + targetName + " ";
  flex_text.bodyText += players[index].role.protection + " kali lagi";

  flex_text.buttons = [
    {
      action: "postback",
      label: "⚔️ Protect dia!",
      data: cmdText
    }
  ];

  return replyFlex(flex_text);
};

const veteranSkill = (flex_text, index) => {
  const skillText = getRoleSkillText("veteran");
  const players = this.group_session.players;
  const cmdText = getRoleCmdText("veteran");

  flex_text.bodyText += "\n\n" + skillText + "\n\n";

  flex_text.bodyText += "💥 Alertmu sisa " + players[index].role.alert;

  flex_text.buttons = [
    {
      action: "postback",
      label: "💥 Alert!",
      data: cmdText
    }
  ];

  return replyFlex(flex_text);
};

const survivorSkill = (flex_text, index) => {
  const skillText = getRoleSkillText("survivor");
  const players = this.group_session.players;
  const cmdText = getRoleCmdText("survivor");

  flex_text.bodyText += "\n\n" + skillText + "\n\n";

  flex_text.bodyText += "🦺 Vest mu sisa " + players[index].role.vest;

  flex_text.buttons = [
    {
      action: "postback",
      label: "🦺 Pake Vest",
      data: cmdText
    }
  ];

  return replyFlex(flex_text);
};

const journalCommand = index => {
  if (this.group_session.state === "new") {
    return replyText("💡 Game belum dimulai");
  }

  const players = this.group_session.players;
  const journals = players[index].journals;

  if (journals.length === 0) {
    return replyText("💡 Kamu belum memiliki jurnal");
  }

  const flex_texts = [];
  let flex_text = {};

  journals.forEach((item, idx) => {
    flex_text[idx] = {
      headerText: "📓 Malam - " + item.nightCounter,
      bodyText: item.content
    };
    flex_texts.push(flex_text[idx]);
  });

  return replyFlex(flex_texts);
};

const announceCommand = index => {
  if (this.group_session.state === "new") {
    return replyText("💡 Game belum dimulai");
  }

  const players = this.group_session.players;
  const state = this.group_session.state;

  if (state === "night" || players[index].status === "death") {
    return journalCommand(index);
  }

  const flex_text = {
    headerText: "🌙 Berita Malam ke - " + this.group_session.nightCounter,
    bodyText: players[index].message
  };

  const journals = players[index].journals;

  if (journals.length === 2) {
    return replyFlex(flex_text, "📓 Kamu bisa cek journal kamu dengan ketik /jurnal");
  } else {
    return replyFlex(flex_text);
  }
};

const deathNoteCommand = index => {
  if (this.group_session.state === "new") {
    return replyText("💡 Game belum dimulai");
  }

  const players = this.group_session.players;

  if (players[index].status === "death") {
    let deathText = respond.alreadyDead(players[index].name, players[index].causeOfDeath);

    // special jester
    if (players[index].role.name !== "jester") {
      return replyText(deathText);
    }

    let isLynched = players[index].role.isLynched;
    let hasRevenged = players[index].role.hasRevenged;
    if (!isLynched) {
      return replyText(deathText);
    }

    if (hasRevenged) {
      return replyText(deathText);
    }
  }

  if (!players[index].role.canKill) {
    return replyText("💡 Kamu gak bisa bunuh-bunuh di role ini");
  }

  if (this.args.length < 2) {
    return replyText("💡 isi death note dengan '/dnote pesan kamu'");
  }

  if (this.args.length > 60) {
    return replyText("💡 Death notenya kepanjangan! Max 60 kata");
  }

  let deathNote = util.parseToText(this.args);
  let text = "";

  this.group_session.players[index].deathNote = deathNote;

  text += "💡 Kamu berhasil membuat 📝 Death Note dengan isi : " + "\n\n";
  text += "'" + deathNote + "'";

  return replyText(text);
};

const refreshCommand = index => {
  if (this.group_session.state !== "night") {
    if (this.group_session.state === "new") {
      return replyText("💡 Game belum dimulai");
    } else {
      return replyText("💡 Belum saatnya chatting");
    }
  }

  const players = this.group_session.players;
  let roleName = players[index].role.name;
  let roleTeam = players[index].role.team;

  if (players[index].status === "death") {
    let text = respond.alreadyDead(players[index].name, players[index].causeOfDeath);
    return replyText(text);
  }

  if (roleTeam !== "mafia" && roleTeam !== "vampire") {
    if (roleName !== "vampire-hunter") {
      return replyText("💡 Team " + roleTeam + " gak ada komunikasi malam");
    }
  }

  let chatBox = [];

  if (roleTeam === "mafia") {
    chatBox = this.group_session.mafiaChat;
  } else if (roleTeam === "vampire") {
    chatBox = this.group_session.vampireChat;
  } else if (roleName === "vampire-hunter") {
    chatBox = this.group_session.vampireHunterChat;
  }

  if (chatBox.length === 0) {
    let noChat = "💡 Belum ada chat, ";
    noChat += "ketik '/r' lagi nanti untuk cek lagi";
    return replyText(noChat);
  }

  if (roleName === "vampire-hunter") {
    roleTeam = "vampire";
  }

  let text = "💬 " + roleTeam.toUpperCase() + " Chat" + "\n\n";

  chatBox.forEach(item => {
    text += item.name + " : " + item.text + "\n";
  });

  return replyText(text);
};

const chatCommand = index => {
  if (this.group_session.state !== "night") {
    if (this.group_session.state === "new") {
      return replyText("💡 Game belum dimulai");
    } else {
      return replyText("💡 Belum saatnya chatting");
    }
  }

  const players = this.group_session.players;
  let roleTeam = players[index].role.team;

  if (roleTeam !== "mafia" && roleTeam !== "vampire") {
    return replyText("💡 " + roleTeam + " gak ada komunikasi malam");
  }

  if (players[index].status === "death") {
    return replyText("💡 Sudah mati, gak bisa chat dengan yang beda dunia");
  }

  if (this.args.length < 2) {
    return replyText("💡 isi chat kamu dengan '/c <kata-kata nya>'");
  }

  let message = {
    name: players[index].name,
    text: util.parseToText(this.args)
  };

  if (roleTeam === "mafia") {
    this.group_session.mafiaChat.push(message);
  } else if (roleTeam === "vampire") {
    this.group_session.vampireChat.push(message);

    // for vampire hunter
    let toVampireHunterMsg = {
      name: "Vampire",
      text: util.parseToText(this.args)
    };
    this.group_session.vampireHunterChat.push(toVampireHunterMsg);
  }

  return replyText("💡 Pesan terkirim! Check chat dengan '/r'");
};

const indexOfPlayer = () => {
  for (let i = 0; i < this.group_session.players.length; i++) {
    if (this.group_session.players[i].id === this.user_session.id) {
      return i;
    }
  }
  return -1;
};

const roleListCommand = () => {
  if (this.group_session.state === "new") {
    return replyText("💡 Game belum dimulai");
  }

  if (!this.group_session.isShowRole) {
    let text = "💡 Tidak dapat melihat role list! ";
    text += "Untuk aktifkan lagi bisa dilakukan setelah ";
    text += "game selesai dengan '/set show_role yes'";
    return replyText(text);
  }

  const roles = this.group_session.roles.join(", ");
  let flex_text = {
    headerText: "🤵 Role List 🕵️",
    bodyText: roles
  };
  return replyFlex(flex_text);
};

const statusCommand = async () => {
  const msg = await stats.statusCommand(this.user_sessions, this.group_sessions);
  return replyFlex(msg);
};

const groupsListCommand = async () => {
  if (this.user_session.id !== process.env.DEV_ID) {
    return invalidCommand();
  }

  const msg = await stats.groupsListCommand(this.group_sessions);

  if (typeof msg === "string") return replyText(msg);

  return replyFlex(msg);
};

const usersListCommand = async () => {
  if (this.user_session.id !== process.env.DEV_ID) {
    return invalidCommand();
  }

  const msg = await stats.usersListCommand(this.user_sessions);

  if (typeof msg === "string") return replyText(msg);

  return replyFlex(msg);
};

const viewCommand = async () => {
  if (this.user_session.id !== process.env.DEV_ID) {
    return invalidCommand();
  }

  const msg = await stats.viewCommand(this.group_sessions, this.args[1]);

  if (typeof msg === "string") return replyText(msg);

  return replyFlex(msg);
};

const infoCommand = () => {
  info.receive(this.event, this.args, this.rawArgs);
};

const helpCommand = () => {
  const state = this.group_session.state;
  const flex_text = util.getHelp(state);
  return replyFlex(flex_text);
};

const commandCommand = () => {
  let text = "";
  const cmds = [
    "/news : cek berita (malam dibunuh siapa, dll)",
    "/role : cek role",
    "/info : info role",
    "/help : bantuan game",
    "/journal : cek journal kamu",
    "/revoke: untuk batal menggunakan skill",
    "/roles : tampilin role list",
    "/updates : untuk melihat 12 update terakhir bot",
    "/players : untuk liat daftar pemain",
    "/pesan pesan : untuk mengirimkan pesan kepada dev bot"
  ];

  cmds.forEach((item, index) => {
    text += "- " + item;
    if (index !== cmds.length - 1) {
      text += "\n";
    }
  });

  let flex_text = {
    headerText: "📚 Daftar Perintah",
    bodyText: text
  };
  return replyFlex(flex_text);
};

const showUpdatesCommand = () => {
  const updates = util.getUpdates();
  return replyFlex(updates);
};

const invalidCommand = () => {
  if (util.hasBadWord(this.args[0])) {
    const randomImageLink = util.getBruhImage();
    return replyImage(randomImageLink);
  }

  const text = `💡 Tidak ditemukan perintah '${this.args[0]}'. Cek daftar perintah yang ada di '/cmd'`;
  return replyText(text);
};

/** helper func **/

const canSelfTarget = role => {
  const canSelfTargetRoles = ["survivor", "veteran", "bodyguard", "arsonist", "doctor", "werewolf"];

  // Juggernaut yang skillLevel udah 3 keatas
  if (role.name === "juggernaut") {
    if (role.skillLevel >= 3) {
      canSelfTargetRoles.push("juggernaut");
    }
  }

  // special role plaguebearer yang udah pestilence
  if (role.name === "plaguebearer") {
    if (role.isPestilence) {
      canSelfTargetRoles.push("plaguebearer");
    }
  }

  if (canSelfTargetRoles.includes(role.name)) {
    return true;
  } else {
    return false;
  }
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
    console.log("err di replyText di personal.js", err.originalError.response.data);
  });
};

const replyFlex = async (flex_raw, text_raw, new_flex_raw) => {
  const state = this.group_session.state;
  let opt_texts = [];
  const sender = {
    name: "Moderator",
    iconUrl:
      "https://cdn.glitch.com/fc7de31a-faeb-4c50-8a38-834ec153f590%2F%E2%80%94Pngtree%E2%80%94microphone%20vector%20icon_3725450.png?v=1587456628843"
  };

  if (text_raw) {
    text_raw = Array.isArray(text_raw) ? text_raw : [text_raw];
    opt_texts = text_raw.map(item => {
      return { type: "text", text: item.trim() };
    });
  }

  if (state !== "idle" && state !== "new") {
    const time = this.group_session.time;
    if (time < 15) {
      let reminder = "💡 ";

      if (time < 1) {
        reminder += "Waktu sudah habis, ketik '/cek' di group untuk lanjutkan proses";
      } else {
        reminder += "Waktu tersisa " + time + " detik lagi, nanti ketik '/cek' di group untuk lanjutkan proses";
      }

      const opt_text = {
        type: "text",
        text: reminder
      };
      opt_texts.push(opt_text);
    }
  }

  let msg = flex.build(flex_raw, sender, opt_texts);

  if (new_flex_raw) {
    const addonMsg = flex.build(new_flex_raw, sender);
    msg = [msg];
    msg.push(addonMsg);
  }

  await client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log(JSON.stringify(msg));
    console.error("err replyFlex di personal.js", err.originalError.response.data.message);
  });
};

const replyImage = async imageLink => {
  await client.replyMessage(this.event.replyToken, {
    type: "image",
    originalContentUrl: imageLink,
    previewImageUrl: imageLink
  });
};

module.exports = {
  receive
};
