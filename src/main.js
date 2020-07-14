const client = require("./client");
const util = require("../util");
const attackedMsg = require("../message/attack");
const peaceMsg = require("../message/peace");
const punishment = require("../message/punishment");
const flex = require("../message/flex");
const setting = require("../src/setting");
const helpFlex = require("../message/help");
const stats = require("./stats");
const info = require("./info");

const receive = (event, args, rawArgs, user_sessions, group_sessions) => {
  this.event = event;
  this.args = args;
  this.rawArgs = rawArgs;
  this.user_sessions = user_sessions;
  this.group_sessions = group_sessions;
  this.user_session = user_sessions[event.source.userId];
  const groupId = util.getGroupId(event);
  this.group_session = group_sessions[groupId];

  if (!rawArgs.startsWith("/")) {
    let time = this.group_session.time;
    const state = this.group_session.state;

    if (state !== "idle") {
      if (state !== "new") {
        if (time <= 10 && time > 0) {
          let reminder = "💡 Waktu tersisa " + time;
          reminder += " detik lagi, nanti ketik '/cek' ";
          reminder += "saat waktu sudah habis untuk lanjutkan proses. ";
          return replyText(reminder);
        } else if (time === 0) {
          if (indexOfPlayer() !== -1) {
            return checkCommand();
          }
        }

        // special role yang bisa trigger lewat text biasa
        let players = this.group_session.players;
        const index = indexOfPlayer();
        if (index !== -1) {
          if (state === "day" || state === "vote") {
            let roleName = players[index].role.name;
            if (roleName === "mayor" && players[index].status === "alive") {
              if (players[index].role.revealed) return Promise.resolve(null);
              let string = args.join(" ");
              string = string.toLowerCase();
              if (string.includes("mayor")) {
                const subjects = ["aku", "ak", "gw", "gue", "gua", "saya"];

                for (let i = 0; i < subjects.length; i++) {
                  if (string.indexOf(subjects[i]) !== -1) {
                    this.group_session.players[index].role.revealed = true;
                    let text = "🎩 " + players[index].name;
                    text += " telah mengungkapkan dirinya sebagai Mayor!";

                    let flex_text = {
                      headerText: "📜 Info",
                      bodyText: text
                    };

                    return replyFlex(flex_text);
                  }
                }
              }
            }
          }
        }
      } else {
        let playersLength = this.group_session.players.length;

        if (playersLength < 5) {
          if (time <= 50 && time > 0) {
            let reminder = "💡 Waktu tersisa " + time;
            reminder +=
              " detik lagi. Jika tidak ada yang join, game akan dihentikan";
            return replyText(reminder);
          }
        }
      }
    }
    return Promise.resolve(null);
  }

  let input = args[0].toLowerCase();
  switch (input) {
    case "/new":
    case "/buat":
    case "/main":
    case "/play":
      return newCommand();
    case "/join":
    case "/j":
      return joinCommand();
    case "/cancel":
    case "/out":
    case "/quit":
    case "/keluar":
    case "/left":
      return cancelCommand();
    case "/start":
    case "/mulai":
    case "/gas":
    case "/anjing":
      return startCommand();
    case "/stop":
      return stopCommand();
    case "/cmd":
      return commandCommand();
    case "/help":
      return helpCommand();
    case "/gamestat":
      return gameStatCommand();
    case "/players":
    case "/player":
    case "/pemain":
    case "/p":
      return playersCommand();
    case "/check":
    case "/cek":
    case "/c":
    case "/cok":
      return checkCommand();
    case "/vote":
      return voteCommand();
    case "/about":
      return aboutCommand();
    case "/status":
      return statusCommand();
    case "/info":
      return infoCommand();
    case "/roles":
    case "/rolelist":
      return roleListCommand();
    case "/tutorial":
      return tutorialCommand();
    case "/role":
    case "/news":
      return personalCommand();
    case "/skip":
      if (this.user_session.id === process.env.DEV_ID) {
        this.group_session.time = 0;
        checkCommand();
      } else {
        return invalidCommand();
      }
      break;
    case "/revoke":
      return revokeCommand();
    case "/extend":
      return extendCommand();
    case "/kick":
      return kickCommand();
    case "/set":
    case "/setting":
      return settingCommand();
    case "/skill":
      return skillCommand();
    case "/forum":
    case "/oc":
    case "/openchat":
      return forumCommand();
    case "/update":
    case "/updates":
      return showUpdatesCommand();
    default:
      return invalidCommand();
  }
};

/// TODO : untuk commands, isi dulu yang static, baru settings, terakhir baru lah logic game

const startCommand = () => {
  if (this.group_session.state !== "new") {
    let text = "";
    if (this.group_session.state === "idle") {
      text += "💡 Belum ada game yang dibuat, ketik '/new'";
    } else {
      text += "💡 " + this.user_session.name + ", game sudah berjalan";
    }
    return replyText(text);
  }

  const index = this.indexOfPlayer();
  const players = this.group_session.players;

  if (index === -1) {
    let text = "💡 " + this.user_session.name;
    text += ", kamu belum join kedalam game";
    return replyText(text);
  }

  let minPlayers = 5;
  if (players.length < minPlayers) {
    let text = "💡 Game belum bisa dimulai, minimal memiliki ";
    text += minPlayers + " pemain";
    return replyText(text);
  }

  if (this.group_session.mode === "custom") {
    let customRolesCount = this.group_session.customRoles.length;
    if (customRolesCount > players.length) {
      return replyText(
        "💡 Game tidak dapat dimulai karena jumlah Custom Roles yang telah di atur melebihi jumlah pemain!"
      );
    }
  }

  this.group_session.punishment = util.random(punishment);

  randomRoles();
};

const randomRoles = () => {
  const players = this.group_session.players;
  const playersLength = players.length;
  let roles = getRandomRoleSet(playersLength); //TODO : logic nya ga perlu pake func ini lagi

  /// test specific role cp
  if (process.env.TEST === "true") {
    //roles = helper.generateRoles(playersLength, "classic");
    //roles = helper.shuffleArray(roles);
  }

  this.group_session.players.forEach((item, index) => {
    if (index <= roles.length - 1) {
      item.role.name = roles[index];
    }

    item.role = this.getRoleData(item.role.name);
  });

  this.group_session.players.forEach((item, index) => {
    /// init private prop special role
    switch (item.role.name) {
      case "executioner":
        item.role.targetLynchIndex = this.getExecutionerTargetIndex(index);
        item.role.isTargetLynched = false;
        break;

      case "guardian-angel":
        item.role.mustProtectIndex = this.getGuardianAngelTargetIndex(index);
        break;
    }
  });

  /// untuk role yang berubah-berubah

  // vampire hunter to vigi
  checkMorphingRole("vampire-hunter", "vampire", "vigilante");

  // set roles list
  this.group_session.roles = this.getRoleList();

  // kasih tau kalo game dh mulai

  let text = "🔔 Hai! Game nya sudah dimulai ya!" + "\n\n";
  text += "Ketik '/role' untuk melihat rolemu, ";
  text += "ketik '/info <nama-role>' untuk info role!";

  const text_obj = {
    type: "text",
    text
  };

  const playersUserId = players.map(p => {
    return p.id;
  });

  // cp
  this.client.multicast(playersUserId, [text_obj]).catch(err => {
    console.error("error pada multicast", err.originalError.response.data.message);
  });

  night(null);
};

const checkCommand = () => {
  const state = this.group_session.state;
  const time = this.group_session.time;
  const name = this.user_session.name;

  if (state !== "idle" && state !== "new") {
    if (indexOfPlayer() === -1) {
      let text = "💡 " + name + ", kamu belum join kedalam game";
      return replyText(text);
    }
  }

  // console.log("state sebelumnya : " + state);

  switch (state) {
    case "night":
      if (time > 0) {
        let remindText =
          "⏳ Sisa waktu " + time + " detik lagi untuk menyambut mentari.";
        return replyText(remindText);
      } else {
        return day();
      }

    case "day":
      return votingCommand();

    case "vote":
      if (time > 0) {
        //munculin button player-player sama kasih tau waktu tersisa berapa detik
        return votingCommand();
      } else {
        return autoVote();
      }

    case "lynch":
      if (time === 0) {
        return postLynch();
      }
      break;

    case "new":
      return gameStatCommand();

    default:
      return replyText(
        "💡 " + name + ", belum ada game yang dibuat, ketik '/new'"
      );
  }
};

const postLynch = () => {
  const lynched = this.group_session.lynched;

  if (!lynched) {
    return night(null);
  } else {
    let someoneWin = checkVictory();

    if (someoneWin) {
      return endGame(null, someoneWin);
    } else {
      substituteMafia(lynched);
      return night(null);
    }
  }
};

const lynch = flex_texts => {
  const players = this.group_session.players;
  let lynchTarget = {};
  const candidates = getVoteCandidates();
  lynchTarget = util.getMostFrequent(candidates);
  let roleName = players[lynchTarget.index].role.name;

  // check if disguiser, the roleName should different
  if (players[lynchTarget.index].role.disguiseAs) {
    roleName = players[lynchTarget.index].role.disguiseAs;
  }

  this.group_session.players[lynchTarget.index].status = "death";

  let lynchedName = players[lynchTarget.index].name;
  let announcement =
    "💀 Warga memutuskan untuk " + this.group_session.punishment + " ";
  announcement += lynchedName + " dengan jumlah " + lynchTarget.count + " vote";

  let emoji = util.getRoleNameEmoji(roleName);
  announcement += `\n\n✉️ Role nya adalah ${roleName} ${emoji}`;

  /// Set special role trigger when lynch
  // khususnya jester dan executioner
  if (roleName === "jester") {
    this.group_session.players[lynchTarget.index].role.isLynched = true;
    this.group_session.players[lynchTarget.index].role.canKill = true;
    announcement += "\n\n" + "👻 Jester akan membalas dendam dari kuburan!";
  }

  // executioner
  for (let i = 0; i < players.length; i++) {
    const status = players[i].status;
    if (players[i].role.name === "executioner" && status === "alive") {
      if (players[i].role.targetLynchIndex == lynchTarget.index) {
        this.group_session.players[i].role.isTargetLynched = true;
      }
    }
  }

  // guardian angel
  for (let i = 0; i < players.length; i++) {
    const status = players[i].status;
    if (players[i].role.name === "guardian-angel" && status === "alive") {
      if (players[i].role.mustProtectIndex == lynchTarget.index) {
        let roleData = this.getRoleData("survivor");
        this.group_session.players[i].role = roleData;
        this.group_session.players[i].role.vest = 0;
      }
    }
  }

  if (!flex_texts[0].body) {
    flex_texts[0].bodyText = announcement;
  } else {
    flex_texts[0].bodyText += "\n\n" + announcement;
  }

  this.group_session.state = "lynch";
  this.group_session.lynched = players[lynchTarget.index];
  this.group_session.time = 8;

  return replyFlex(flex_texts);
};

const voteCommand = () => {
  if (this.group_session.state !== "vote") {
    return Promise.resolve(null);
  }

  const index = this.indexOfPlayer();
  const players = this.group_session.players;

  if (index === -1) {
    let text =
      "💡 " + this.user_session.name + ", kamu belum join kedalam game";
    return replyText(text);
  }

  if (players[index].status !== "alive") {
    let text = "💡 " + this.user_session.name + ", kamu sudah mati";
    return replyText(text);
  }

  if (!this.args[1]) {
    return votingCommand();
  }

  const targetIndex = this.args[1];

  if (parseInt(targetIndex) === parseInt(index)) {
    let text = "💡 " + this.user_session.name + ", gak bisa vote diri sendiri";
    return replyText(text);
  }

  if (!players[targetIndex]) {
    return replyText("💡 " + this.user_session.name + ", invalid vote");
  }

  if (players[targetIndex].protected) {
    let targetName = players[targetIndex].name;
    let text = "💡 " + this.user_session.name + ", ";
    text +=
      targetName + " immune dari vote karena perlindungan Guardian Angel!";
    return replyText(text);
  }

  let text = "☝️ " + this.user_session.name;

  if (players[index].targetVoteIndex === -1) {
    text += " vote ";
  } else if (players[index].targetVoteIndex === targetIndex) {
    text = "💡 " + this.user_session.name + ", kamu sudah vote ";
  } else {
    text += " mengganti vote ke ";
  }

  this.group_session.players[index].afkCounter = 0;

  this.group_session.players[index].targetVoteIndex = targetIndex;

  text +=
    players[targetIndex].name + " untuk di" + this.group_session.punishment;

  const voteNeeded = Math.round(this.getAlivePlayersCount() / 2);

  const headerText = "📣 Voting";

  const time = this.group_session.time;

  const checkVote = checkVoteStatus(voteNeeded);

  if (checkVote.status !== "enough_vote") {
    let voteFlex = "💡 Ketik '/cek' untuk munculin flex vote. ";

    if (time > 15) {
      voteFlex += "⏳ Waktu tersisa " + this.group_session.time + " detik lagi";
    }

    text += "\n" + voteFlex;
    return replyText(text);
  } else {
    const flex_text = {
      headerText,
      bodyText: text
    };

    const alivePlayers = getAlivePlayers();
    const playerListFlex = getTableFlex(alivePlayers, null, headerText);
    return lynch([flex_text, playerListFlex]);
  }
};

const votingCommand = () => {
  const players = this.group_session.players;

  let text = "";
  const time = this.group_session.time;

  if (this.group_session.state === "day") {
    if (time > 0) {
      let remindText =
        "💡 " + this.user_session.name + ", belum saatnya voting" + "\n";
      remindText += "⏳ Sisa waktu " + time + " detik lagi untuk voting";
      return replyText(remindText);
    } else {
      // ini pertama kali votingCommand dipakai
      this.group_session.state = "vote";
      this.group_session.lynched = null;

      runTimer();

      let default_time = this.group_session.time_default;
      text += "⏳ Waktu yang diberikan " + default_time + " detik" + "\n";
    }
  }

  const voteNeeded = Math.round(this.getAlivePlayersCount() / 2);
  const voteNeededText = "\n" + "💡 Dibutuhkan " + voteNeeded;
  voteNeededText += " vote untuk " + this.group_session.punishment + " orang";

  let flexBodyText =
    "💀 Pilih siapa yang mau di" + this.group_session.punishment + "\n";
  flexBodyText += text + voteNeededText;

  if (this.group_session.nightCounter === 1) {
    flexBodyText += "\n\n" + "💡 Untuk batal vote bisa ketik '/revoke'";
  }

  let flex_texts = [];
  let flex_text = {
    headerText: "📣 Voting",
    bodyText: flexBodyText,
    buttons: []
  };

  let button = {};
  players.forEach((item, index) => {
    if (item.status === "alive") {
      button[index] = {
        action: "postback",
        label: item.name,
        data: "/vote " + index
      };

      flex_text.buttons.push(button[index]);
    }
  });
  flex_texts.push(flex_text);

  const alivePlayers = getAlivePlayers();
  const playerListFlex = getTableFlex(alivePlayers, null, "📣 Voting");
  flex_texts.push(playerListFlex);

  return replyFlex(flex_texts);
};

const autoVote = () => {
  const voteNeeded = Math.round(getAlivePlayersCount() / 2);

  let headerText = "";
  let text = "";
  const flex_text = {
    headerText: "",
    bodyText: ""
  };

  this.group_session.players.forEach(item => {
    if (item.status === "alive") {
      if (item.targetVoteIndex === -1) {
        item.afkCounter++;
      } else {
        item.afkCounter = 0;
      }
    }
  });

  let checkVote = checkVoteStatus(voteNeeded);

  if (checkVote.status !== "enough_vote") {
    headerText = "📣 Penghukuman ditunda";
    text =
      "💬 Waktu habis dan warga belum menentukan siapa yang akan di" +
      this.group_session.punishment;
  } else {
    headerText = "📣 Voting";
  }

  const alivePlayers = getAlivePlayers();
  const playerListFlex = getTableFlex(alivePlayers, null, headerText);

  if (checkVote.status !== "enough_vote") {
    this.group_session.state = "lynch";
    this.group_session.time = 8;

    flex_text.headerText = headerText;
    flex_text.bodyText = text;
    return replyFlex([flex_text, playerListFlex]);
  } else {
    flex_text.headerText = headerText;
    return lynch([flex_text, playerListFlex]);
  }
};

const getAlivePlayersCount = () => {
  let count = 0;
  this.group_session.players.forEach(item => {
    if (item.status === "alive") {
      count++;
    }
  });
  return count;
};

const getTableFlex = (alivePlayers, text, headerText, opt_buttons) => {
  const players = this.group_session.players;
  const flex_text = {
    headerText
  };

  if (text) {
    flex_text.bodyText = text + "\n";
  }

  if (opt_buttons) {
    flex_text.buttons = opt_buttons;
  }

  flex_text.table = {
    headers: [],
    contents: []
  };

  let num = 1;
  alivePlayers.forEach((voter, index) => {
    let table_data = [`${num}.`, voter.name];

    if (voter.targetVoteIndex === -1) {
      table_data.push("pending", "-");
    } else {
      table_data.push("done", players[voter.targetVoteIndex].name);
    }

    num++;

    flex_text.table.contents.push(table_data);
  });

  return flex_text;
};

const getAlivePlayers = () => {
  let alivePlayers = [];
  this.group_session.players.forEach(item => {
    if (item.status === "alive") {
      alivePlayers.push(item);
    }
  });
  return alivePlayers;
};

const checkVoteStatus = voteNeeded => {
  let response = {
    status: "no_candidate",
    lynchTarget: {}
  };

  const notVote = getNotVotePlayers();
  const players = this.group_session.players;

  if (this.group_session.time === 0 || notVote.length === 0) {
    const candidates = getVoteCandidates();

    let lynchTarget = util.getMostFrequent(candidates);

    if (players[lynchTarget.index] && lynchTarget.count >= voteNeeded) {
      response.lynchTarget = lynchTarget;
      response.status = "enough_vote";
    }
  }

  return response;
};

const getNotVotePlayers = () => {
  let notVote = [];
  this.group_session.players.forEach(item => {
    if (item.status === "alive" && item.targetVoteIndex === -1) {
      notVote.push(item);
    }
  });
  return notVote;
};

const getVoteCandidates = () => {
  let candidates = [];
  this.group_session.players.forEach(item => {
    if (item.status === "alive" && item.targetVoteIndex !== -1) {
      candidates.push(item.targetVoteIndex);

      if (item.role.name === "mayor" && item.role.revealed) {
        candidates.push(item.targetVoteIndex, item.targetVoteIndex);
      }
    }
  });
  return candidates;
};

const revokeCommand = () => {
  const state = this.group_session.state;
  if (state !== "vote") {
    let text = "";
    if (state === "idle") {
      text = "💡 " + this.user_session.name;
      text += ", belum ada game yang dibuat, ketik '/new'";
    } else {
      text = "💡 " + this.user_session.name + ", belum saatnya voting";
    }
    return replyText(text);
  }

  const index = this.indexOfPlayer();

  if (index === -1) {
    let text = "💡 " + this.user_session.name;
    text += ", kamu belum join kedalam game";
    return replyText(text);
  }

  const players = this.group_session.players;

  if (players[index].status !== "alive") {
    let text = "💡 " + this.user_session.name + ", kamu sudah mati";
    return replyText(text);
  }

  if (players[index].targetVoteIndex === -1) {
    let text = "💡 " + this.user_session.name;
    text += ", kamu belum vote siapa - siapa";
    return replyText(text);
  }

  const pastTargetVoteName = players[players[index].targetVoteIndex].name;

  this.group_session.players[index].targetVoteIndex = -1;

  let text = "💡 " + this.user_session.name;
  text += " batal vote " + pastTargetVoteName;
  return replyText(text);
};

const skillCommand = () => {
  if (this.user_session.id !== process.env.DEV_ID) {
    return invalidCommand();
  }

  const doerIndex = this.args[1];
  const targetIndex = this.args[2];

  if (doerIndex === undefined || targetIndex === undefined) {
    return replyText("/skill doerIndex targetIndex");
  }

  this.group_session.players[doerIndex].target.index = targetIndex;
};

const roleListCommand = () => {
  if (this.group_session.state === "idle") {
    return replyText("💡 Belum ada game yang dibuat, ketik '/new'");
  } else if (this.group_session.state === "new") {
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
    bodyText: `${roles}\n\n📜 Ex : '/info town investigate' untuk tau role apa aja dari tipe TI"`
  };
  return replyFlex(flex_text);
};

const gameStatCommand = () => {
  const state = this.group_session.state;
  const players = this.group_session.players;

  let bodyText = "";
  if (state === "idle") {
    return replyText("💡 Belum ada game yang dibuat");
  }

  bodyText += "🕹️ Game mode : " + this.group_session.mode + "\n\n";

  if (this.group_session.mode === "custom" && this.group_session.isShowRole) {
    const customRoles = this.group_session.customRoles;
    bodyText += "📜 Roles : " + customRoles.join(", ") + "\n\n";
  }

  bodyText += "✉️ Show role : " + this.group_session.isShowRole + "\n\n";

  const roomHostIndex = this.getPlayerIndexById(this.group_session.roomHostId);
  const roomHostName = players[roomHostIndex].name;
  bodyText += "👑 Room Host : " + roomHostName;

  let flex_text = {
    headerText: "🎮 Game Stat",
    bodyText: ""
  };

  if (state === "new") {
    flex_text.bodyText = bodyText;
    return replyFlex(flex_text);
  }

  bodyText += "\n\n";

  let nightCount = this.group_session.nightCounter;
  let diedPlayerCount = 0;
  players.forEach(item => {
    if (item.status === "death") {
      diedPlayerCount++;
    }
  });

  if (diedPlayerCount > 0) {
    bodyText += "Total yang mati sudah 💀 " + diedPlayerCount + " orang ";
    bodyText += "dalam 🌕 " + nightCount + " malam";
  } else {
    bodyText += "🌕 Belum ada yang mati dalam " + nightCount + " malam ini";
  }

  flex_text.bodyText = bodyText;
  return replyFlex(flex_text);
};

const playersCommand = () => {
  if (this.group_session.state === "idle") {
    return replyText("💡 Belum ada game yang dibuat, ketik '/new'");
  }

  const players = this.group_session.players;
  if (players.length === 0) {
    return replyText("💡 Belum ada pemain, ketik '/join' utk bergabung");
  }

  let flex_text = {
    headerText: "🤵 Daftar Pemain 👨‍🌾",
    table: {
      headers: ["No.", "Name", "Status"],
      contents: []
    }
  };

  let num = 1;
  players.forEach((item, index) => {
    let table_data = [`${num}.`, item.name];

    if (item.status === "death") {
      table_data.push("💀");
    } else {
      table_data.push("😃");
    }

    if (this.group_session.state !== "new") {
      flex_text.table.headers.push("Role");

      if (item.status === "death") {
        if (item.role.disguiseAs) {
          table_data.push(item.role.disguiseAs);
        } else {
          table_data.push(item.role.name);
        }
      }
    }

    num++;

    flex_text.table.contents.push(table_data);
  });

  if (this.group_session.state === "new") {
    flex_text.buttons = [
      {
        action: "postback",
        label: "join",
        data: "/join"
      }
    ];
  }

  return replyFlex(flex_text);
};

const extendCommand = () => {
  if (this.group_session.state !== "new") {
    let text = "";
    if (this.group_session.state === "idle") {
      text = "💡 Belum ada game yang dibuat, ketik '/new' untuk buat";
    } else {
      text = "💡 Waktu gak bisa ditambahkan saat game sudah berjalan";
    }
    return replyText(text);
  }

  if (this.group_session.time >= 600) {
    let minute = Math.round(this.group_session.time / 60);
    let text = "💡 Belum bisa menambah waktu tunggu. ";
    text += "⏳ Waktu masih tersisa " + minute + " menit";
    return replyText(text);
  }

  this.group_session.time += 60;

  let remind = "⏳ Waktu berhasil di tambah 1 menit. ";
  remind += "Sisa waktu ";

  if (this.group_session.time > 90) {
    let minute = Math.round(this.group_session.time / 60);
    remind += minute + " menit lagi. ";
    remind += "💡 Game akan di berhentikan jika waktu telah habis. ";
  } else {
    remind += this.group_session.time + " detik lagi";
  }

  return replyText(remind);
};

const kickCommand = async () => {
  const groupId = this.group_session.groupId;
  let text = "👋 Selamat tinggal";

  if (this.event.source.type === "group") {
    let res = await client.getGroupSummary(groupId);
    text += " " + res.groupName + "!";
  } else {
    text += "!";
  }

  return util.leaveGroup(this.event, groupId, text);
};

const stopCommand = () => {
  if (this.group_session.state === "idle") {
    return replyText("💡 Belum ada game yang dibuat, ketik '/new'");
  }

  const index = indexOfPlayer();

  if (index === -1) {
    let text = "💡 " + this.user_session.name;
    text += ", kamu belum join kedalam game";
    return replyText(text);
  }

  if (this.user_session.id !== this.group_session.roomHostId) {
    const currentRoomHostId = this.group_session.roomHostId;
    const roomHostIndex = this.getPlayerIndexById(currentRoomHostId);
    const players = this.group_session.players;
    let text = "💡 Yang bisa stop game hanya Host Room saja. ";
    text += "👑 Host Room : " + players[roomHostIndex].name;
    return replyText(text);
  }

  this.group_session.state = "idle";
  this.group_session.time = 300; // reset to initial time

  resetAllPlayers();

  const text = "💡 Game telah di stop " + this.user_session.name;
  return replyText(text);
};

const cancelCommand = () => {
  if (this.group_session.state !== "new") {
    let text = "";
    if (this.group_session.state === "idle") {
      text += "💡 Belum ada game yang dibuat, ketik '/new'";
    } else {
      text += "💡 " + this.user_session.name + ", game sedang berjalan. ";
    }
    return replyText(text);
  }

  const index = indexOfPlayer();

  if (index === -1) {
    let text = "💡 " + this.user_session.name;
    text += ", kamu belum join kedalam game";
    return replyText(text);
  }

  util.cutFromArray(this.group_session.players, index);

  let text = "💡 " + this.user_session.name + " telah meninggalkan game. ";

  if (this.group_session.players.length === 0) {
    this.group_session.state = "idle";
    text += "\n" + "💡 Game di stop karena tidak ada pemain";
  } else {
    if (this.group_session.roomHostId === this.user_session.id) {
      let randomPlayer = util.random(this.group_session.players);
      this.group_session.roomHostId = randomPlayer.id;
      text += "\n" + "👑 " + randomPlayer.name;
      text += " menjadi host baru dalam room ini. ";
    }
  }

  this.user_session.state = "inactive";
  this.user_session.groupId = "";
  this.user_session.groupName = "";

  return replyText(text);
};

const joinCommand = () => {
  if (this.group_session.state !== "new") {
    let text = "";
    if (this.group_session.state === "idle") {
      text += "💡 " + this.user_session.name;
      text += ", belum ada game yang dibuat, ketik '/new'";
    } else {
      text += "💡 " + this.user_session.name + ", game sedang berjalan";
    }
    return replyText(text);
  }

  if (this.user_session.state === "active") {
    let text = "";
    if (this.user_session.groupId === this.group_session.groupId) {
      text += "💡 " + this.user_session.name;
      text += ", kamu sudah bergabung kedalam game";
    } else {
      text += "💡 " + this.user_session.name;
      text += ", kamu masih berada didalam game ";

      const groupName = this.user_session.groupName;

      if (!groupName) {
        text += " room lain";
      } else {
        text += "group " + groupName;
      }
    }
    return replyText(text);
  }

  if (this.group_session.players.length === 0) {
    this.group_session.roomHostId = this.user_session.id;
  }

  if (this.group_session.players.length === 15) {
    let text = "💡 " + this.user_session.name;
    text += ", room sudah penuh";
    return replyText(text);
  }

  this.user_session.state = "active";
  this.user_session.groupId = this.group_session.groupId;
  this.user_session.groupName = this.group_session.name;

  let newPlayer = createNewPlayer(this.user_session);

  this.group_session.players.push(newPlayer);

  let reminder = "⏳ Sisa waktu ";

  if (this.group_session.time > 90) {
    let minute = Math.round(this.group_session.time / 60);
    reminder += minute + " menit lagi";
  } else {
    reminder += this.group_session.time + " detik lagi";
  }

  let text =
    "💡 " + this.user_session.name + " berhasil bergabung!" + "\n" + reminder;

  if (this.group_session.players.length >= 5) {
    if (this.group_session.players.length === 15) {
      text += "\n" + "📣 Room sudah penuh, game bisa dimulai";
    } else {
      text += "\n" + "📣 Sudah cukup pemain, game bisa dimulai";
    }
  }

  return replyText(text);
};

const newCommand = () => {
  if (this.group_session.state !== "idle") {
    let text = "";
    if (this.group_session.state === "new") {
      text += "💡 " + this.user_session.name;
      text += ", sudah ada game yang dibuat di grup ini";
    } else {
      text += "💡 " + this.user_session.name + ", game sedang berjalan";
    }
    return replyText(text);
  }

  if (this.user_session.state === "active") {
    let errorText = "💡 " + this.user_session.name + ", ";
    errorText += "kamu masih berada didalam game ";

    const groupName = this.user_session.groupName;

    if (!groupName) {
      errorText += "room lain";
    } else {
      errorText += "group " + groupName;
    }

    return replyText(errorText);
  }

  this.group_session.state = "new";
  this.group_session.players.length = 0;
  this.group_session.nightCounter = 0;
  this.group_session.roomHostId = "";
  this.group_session.time = 600;
  this.group_session.lynched = null;
  this.group_session.vampireConvertCooldown = 0;
  this.group_session.isFullMoon = false;

  let infoText = "🕹️ Mode : " + this.group_session.mode;

  if (this.group_session.mode === "custom" && this.group_session.isShowRole) {
    let customRoles = this.group_session.customRoles;
    infoText += "\n" + "📜 Roles : " + customRoles.join(", ");
  }

  const flex_text = {
    headerText: "🎮 Game Baru",
    bodyText: infoText,
    buttons: [
      {
        action: "postback",
        label: "join",
        data: "/join"
      }
    ]
  };

  let remindText = "⏳ Jika jumlah pemain kurang dari 5 dalam 10 menit, ";
  remindText += "game akan diberhentikan";

  this.group_session.roomHostId = this.user_session.id;
  this.user_session.state = "active";
  this.user_session.groupId = this.group_session.groupId;
  this.user_session.groupName = this.group_session.name;

  const newPlayer = createNewPlayer(this.user_session);
  this.group_session.players.push(newPlayer);

  if (process.env.TEST === "true") {
    // cp
    for (let i = 0; i < 4; i++) {
      let dummy = JSON.parse(JSON.stringify(this.user_session));
      dummy.name += ` ${i}`;
      let newPlayer = createNewPlayer(dummy);
      this.group_session.players.push(newPlayer);
    }
  }

  const text = "💡 " + this.user_session.name + " berhasil bergabung!";
  return replyFlex(flex_text, [text, remindText]);
};

const settingCommand = () => {
  const state = this.group_session.state;
  if (state !== "idle" && state !== "new") {
    let text = "💡 " + this.user_session.name;
    text += ", setting hanya bisa di atur saat game belum berjalan";
    return replyText(text);
  }

  return setting.receive(
    this.event,
    this.args,
    this.rawArgs,
    this.group_sessions,
    this.user_sessions
  );
};

const commandCommand = () => {
  const flex_texts = [];
  let firstText = "";
  let secondText = "";
  const cmds = [
    "/new : main game",
    "/cancel : keluar game",
    "/join : join game",
    "/players : cek list pemain",
    "/stop : stop game",
    "/start : start game",
    "/info : tampilin list role",
    "/about : tentang bot",
    "/revoke : untuk batal voting",
    "/extend : untuk menambah 1 menit saat baru membuat room game",
    "/kick : untuk mengeluarkan bot dari group atau room chat",
    "/setting : untuk melihat pengaturan game",
    "/tutorial : tutorial menggunakan bot ini",
    "/gamestat : status game yang berjalan di grup ini",
    "/forum : link ke openchat",
    "/updates : untuk melihat 5 update terakhir bot"
  ];

  for (let i = 0; i < cmds.length; i++) {
    if (i > 7) {
      secondText += "- " + cmds[i] + "\n";
    } else {
      firstText += "- " + cmds[i] + "\n";
    }
  }

  for (let i = 0; i < 2; i++) {
    let flex_text = {
      headerText: "📚 Daftar Perintah",
      bodyText: ""
    };

    if (i === 0) {
      flex_text.bodyText = firstText;
    } else {
      flex_text.bodyText = secondText;
    }

    flex_texts.push(flex_text);
  }

  return replyFlex(flex_texts);
};

const helpCommand = () => {
  const state = this.group_session.state;
  const flex_text = util.getHelp(state);
  return replyFlex(flex_text);
};

const statusCommand = () => {
  const msg = stats.statusCommand(this.user_sessions, this.group_sessions);
  return replyFlex(msg);
};

const infoCommand = () => {
  info.receive(this.event, this.args);
};

const tutorialCommand = () => {
  const msg = util.getTutorial();
  return replyFlex(msg);
};

const aboutCommand = () => {
  const flex_text = util.getAbout();
  return replyFlex(flex_text);
};

const personalCommand = () => {
  const text = `💡 ${this.user_session.name}, commad ${
    this.args[0]
  } hanya boleh dilakukan di pc bot`;
  return replyText(text);
};

const forumCommand = () => {
  const msg = util.getForumInfo();
  return replyFlex(msg);
};

const showUpdatesCommand = () => {
  const updates = util.getUpdates();
  return replyFlex(updates);
};

const invalidCommand = () => {
  const text = `💡 Tidak ditemukan perintah '${
    this.args[0]
  }'. Cek daftar perintah yang ada di '/cmd'`;
  return replyText(text);
};

/** helper func **/

const runTimer = () => {
  this.group_session.time = this.group_session.time_default;
};

const resetAllPlayers = () => {
  this.group_session.players.forEach(item => {
    this.user_sessions[item.id].state = "inactive";
    this.user_sessions[item.id].groupId = "";
    this.user_sessions[item.id].groupName = "";
  });
  this.group_session.players.length = 0;
};

const createNewPlayer = user_session => {
  // di sini set prop yang ga bisa di reset tiap malam, dan bisa persistent sepanjang game
  let newPlayer = {
    id: user_session.id,
    name: user_session.name,
    role: {
      name: "villager",
      team: "villager"
    },
    status: "alive",
    targetVoteIndex: -1,
    afkCounter: 0,
    journals: [],
    deathNote: "",
    willSuicide: false,
    doused: false,
    burned: false,
    infected: false,
    justInfected: false
  };
  return newPlayer;
};

const indexOfPlayer = () => {
  for (let i = 0; i < this.group_session.players.length; i++) {
    if (this.group_session.players[i].id === this.user_session.id) {
      return i;
    }
  }
  return -1;
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
    console.log("err di replyText di main.js", err.originalError.response.data);
  });
};

const replyFlex = (flex_raw, text_raw) => {
  let state = this.group_session.state;
  let opt_texts = [];
  let sender = {};

  if (text_raw) {
    text_raw = Array.isArray(text_raw) ? text_raw : [text_raw];
    opt_texts = text_raw.map(item => {
      return { type: "text", text: item };
    });
  }

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

      const opt_text = {
        type: "text",
        text: reminder
      };
      opt_text.push(opt_text);
    }
  } else {
    sender = util.getSender();
  }

  const msg = flex.build(flex_raw, sender, opt_texts);
  return client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log(JSON.stringify(msg));
    console.error(
      "err replyFlex di main.js",
      err.originalError.response.data.message
    );
  });
};

module.exports = {
  receive
};
