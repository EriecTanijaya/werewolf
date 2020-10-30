const client = require("./client");
const flex = require("../message/flex");
const util = require("../util");
const attackedMsg = require("../message/attack");
const peaceMsg = require("../message/peace");
const punishment = require("../message/punishment");
const respond = require("../message/respond");
const setting = require("./setting");
const stats = require("./stats");
const info = require("./info");
const modes = require("../modes");
const rawRoles = require("../roles");
const database = require("../database");
const bots = require("../bots");

const accusedWords = ["jahat", "jhat", "bersalah", "salah", "mencurigakan"];
const infoWords = ["info", "inpo", "infoo", "info?", "infoo?"];
const claimRoleWords = ["role", "rolee", "role?", "rolee?", "claim", "claim?"];
const lieWords = ["bacod", "bacot", "bohong", "nipu", "tipu", "bct", "bcd"];
const framedWords = ["framer", "jester"];
const dousedWords = ["arso", "arsonist", "arsonis"];
const evilTeams = [
  "mafia",
  "executioner",
  "jester",
  "vampire",
  "serial-killer",
  "arsonist",
  "werewolf",
  "juggernaut",
  "plaguebearer"
];

const botGetAccusedRole = () => {
  const evilRoles = [
    "godfather",
    "mafioso",
    "disguiser",
    "framer",
    "consort",
    "consigliere",
    "executioner",
    "jester",
    "vampire",
    "serial-killer",
    "arsonist",
    "werewolf",
    "juggernaut",
    "plaguebearer"
  ];
  return util.random(evilRoles);
};

const botTellFakeInfo = bot => {
  const players = this.group_session.players;
  const justDeadIndexes = this.group_session.justDeadIndexes;
  const needJustDeadBait = ["lookout", "tracker"];

  if (bot.claimedRole.name !== "") {
    const path = "bot_" + bot.claimedRole.name;

    if (!bots[path]) return;

    const botTargetIndex = bot.claimedRole.targetIndex;
    if (players[botTargetIndex].status === "death") {
      const newTargetIndex = botGetTargetIndex(bot);
      bot.claimedRole.targetIndex = newTargetIndex;
      if (bot.claimedRole.name === "investigator") {
        bot.claimedRole.accusedRole = botGetAccusedRole();
      }
    }

    if (needJustDeadBait.includes(bot.claimedRole.name)) {
      if (justDeadIndexes.length === 0) {
        const res = bots[path](players, justDeadIndexes, bot);
        return replyText(res, bot);
      }

      const justDeadBaitIndex = bot.claimedRole.justDeadBaitIndex;

      if (!justDeadIndexes.includes(justDeadBaitIndex) || justDeadBaitIndex === -1) {
        const randomDeadIndex = util.random(justDeadIndexes);
        bot.claimedRole.justDeadBaitIndex = randomDeadIndex;
      }
    }

    const res = bots[path](players, justDeadIndexes, bot);
    return replyText(res, bot);
  }

  const availableRoles = ["investigator", "sheriff"];
  if (justDeadIndexes.length > 0) {
    availableRoles.push("lookout", "tracker");
  }

  const randomRole = util.random(availableRoles);
  let targetIndex = -1;

  if (bot.role.name === "executioner") {
    targetIndex = bot.role.targetLynchIndex;
  } else {
    targetIndex = botGetTargetIndex(bot);
  }

  bot.claimedRole.name = randomRole;
  bot.claimedRole.targetIndex = targetIndex;

  if (randomRole === "investigator") {
    bot.claimedRole.accusedRole = botGetAccusedRole();
  }

  if (needJustDeadBait.includes(bot.claimedRole.name)) {
    if (justDeadIndexes.length === 0) {
      const res = bots[path](players, justDeadIndexes, bot);
      return replyText(res, bot);
    }

    const randomDeadIndex = util.random(justDeadIndexes);
    bot.claimedRole.justDeadBaitIndex = randomDeadIndex;
  }

  const path = "bot_" + randomRole;
  const res = bots[path](players, justDeadIndexes, bot);
  return replyText(res, bot);
};

const botGetTargetIndex = bot => {
  const alivePlayersIndex = this.group_session.players
    .map((item, index) => {
      if (item.status === "alive" && item.id !== bot.id) {
        if (bot.role.team === "mafia" || bot.role.team === "vampire") {
          if (bot.role.team !== item.role.team) {
            return index;
          }
        } else {
          return index;
        }
      }
    })
    .filter(item => {
      return item !== undefined;
    });

  return util.random(alivePlayersIndex);
};

const botTellFakeRole = bot => {
  if (bot.claimedRole.name !== "") {
    const text = `Role ku ${bot.claimedRole.name}`;
    return replyText(text, bot);
  }

  const fakeRoles = [
    "amnesiac",
    "survivor",
    "jester",
    "veteran",
    "retributionist",
    "doctor",
    "vigilante",
    "bodyguard",
    "escort"
  ];

  const randomRole = util.random(fakeRoles);

  bot.claimedRole.name = randomRole;

  return replyText(`Role ku ${randomRole}`, bot);
};

const botTellInfo = () => {
  const players = this.group_session.players;
  const botIds = util.getFakeData(14).map(item => {
    return item.id;
  });

  let currentBotIds = this.group_session.players
    .map(item => {
      if (botIds.includes(item.id) && item.status === "alive") {
        return item.id;
      }
    })
    .filter(item => {
      return item !== undefined;
    });

  const infoTeller = ["investigator", "lookout", "psychic", "sheriff", "spy", "tracker", "consigliere"];

  currentBotIds = util.shuffleArray(currentBotIds);

  let options = ["scam", "truth"];
  if (checkExistsRole("mayor")) {
    const reveal = util.random([false, false, false, true, false]);
    if (reveal) options.push("reveal");
  }

  const what = util.random(options);

  for (let i = 0; i < currentBotIds.length; i++) {
    const botIndex = indexOfBot(currentBotIds[i]);

    if (what === "truth") {
      if (infoTeller.includes(players[botIndex].role.name)) {
        if (!players[botIndex].skillResult) continue;

        if (players[botIndex].role.name === "consigliere") {
          const personalTargetIndex = players[botIndex].targetIndex;
          const targetName = players[personalTargetIndex].name;
          const investResult = util.getInvestigatorResult(players[personalTargetIndex].role.name);
          return replyText(`Cek ${targetName}\n${investResult}`, players[botIndex]);
        }

        return replyText(players[botIndex].skillResult, players[botIndex]);
      }
    } else if (what === "scam") {
      if (evilTeams.includes(players[botIndex].role.team)) {
        return botTellFakeInfo(players[botIndex]);
      }
    } else if (what === "reveal") {
      botMayorReveal();
    }
  }
};

const botMayorReveal = () => {
  const players = this.group_session.players;
  const botIds = util.getFakeData(14).map(item => {
    return item.id;
  });

  for (let i = 0; i < players.length; i++) {
    const id = players[i].id;
    const roleName = players[i].role.name;
    const status = players[i].status;

    if (botIds.includes(id) && roleName === "mayor" && status === "alive") {
      if (!players[i].role.revealed) {
        this.group_session.players[i].role.revealed = true;
        let text = "🎩 " + players[i].name;
        text += " telah mengungkapkan dirinya sebagai Mayor!";

        let flex_text = {
          headerText: "📜 Info",
          bodyText: text
        };

        return replyFlex(flex_text);
      }
    }
  }
};

const indexOfBot = botId => {
  for (let i = 0; i < this.group_session.players.length; i++) {
    if (this.group_session.players[i].id === botId) {
      return i;
    }
  }
  return -1;
};

const botSpeakAction = botName => {
  const players = this.group_session.players;

  for (let i = 0; i < players.length; i++) {
    if (players[i].name.toLowerCase() === botName) {
      const bot = players[i];

      if (bot.status === "death") return;

      for (let j = 0; j < this.args.length; j++) {
        const input = this.args[j].toLowerCase();
        if (accusedWords.includes(input)) {
          return justDeny(bot);
        }

        if (claimRoleWords.includes(input)) {
          return botClaimRole(bot);
        }

        if (framedWords.includes(input)) {
          return replyText(`Aku bukan ${input}, aku di frame`, bot);
        }

        if (dousedWords.includes(input)) {
          return replyText(`Aku bukan ${input}, aku di sirami bensin`, bot);
        }

        if (lieWords.includes(input)) {
          return botDenyLies(bot);
        }
      }
    }
  }
};

const botDenyLies = bot => {
  const denies = [
    "Aku ga bohong",
    "Aku jujur nih",
    "Ga percaya yaudah",
    "Info ku valid",
    "Aku tidak boong",
    "Aku jujur"
  ];
  return replyText(util.random(denies), bot);
};

const botClaimRole = bot => {
  const players = this.group_session.players;

  if (bot.claimedRole.name !== "") {
    return replyText(`Role ku ${bot.claimedRole.name}`, bot);
  }

  if (evilTeams.includes(bot.role.team)) {
    return botTellFakeRole(bot);
  }

  if (bot.role.name === "guardian-angel") {
    const targetName = players[bot.role.mustProtectIndex].name;
    return replyText(`Role ku guardian angel, targetku ${targetName}`, bot);
  }

  return replyText(`Role ku ${bot.role.name}`, bot);
};

const justDeny = bot => {
  const denies = [
    "Aku aman",
    "Aku bukan orang jahat",
    "Aku baik",
    "Role ku penting",
    "Role ku sangat penting",
    "Jangan micin, aku role baik"
  ];
  return replyText(util.random(denies), bot);
};

const botVote = () => {
  const players = this.group_session.players;
  let accusedName = "";

  if (!isNaN(this.args[1])) {
    const input = parseInt(this.args[1]) - 1;

    const alivePlayerIndexes = players
      .map((item, index) => {
        if (item.status === "alive") {
          return index;
        }
      })
      .filter(item => {
        return item !== undefined;
      });

    if (alivePlayerIndexes[input] !== undefined) {
      const targetIndex = alivePlayerIndexes[input];
      accusedName = players[targetIndex].name.toLowerCase();
    }
  } else {
    accusedName = util.parseToText(this.args).toLowerCase();
  }

  const botIds = util.getFakeData(14).map(item => {
    return item.id;
  });

  const candidates = getVoteCandidates();
  let voteTarget = util.getMostFrequent(candidates);

  let accusedTargetIndex = -1;
  for (let i = 0; i < players.length; i++) {
    if (players[i].name.toLowerCase() === accusedName) {
      accusedTargetIndex = i;
      break;
    }
  }

  for (let i = 0; i < players.length; i++) {
    const item = players[i];

    if (botIds.includes(item.id) && item.status === "alive") {
      if (item.targetVoteIndex !== -1) continue;

      let targetIndex = item.claimedRole.targetIndex === -1 ? -1 : item.claimedRole.targetIndex;

      if (targetIndex !== -1 && players[targetIndex].status === "alive") {
        return voteCommand(i, targetIndex);
      }

      const options = ["mayoritas", "random"];
      if (accusedTargetIndex !== -1) {
        options.push("follow");
      }

      const what = util.random(options);

      if (what === "follow" && i !== accusedTargetIndex) {
        return voteCommand(i, accusedTargetIndex);
      } else if (what === "mayoritas") {
        if (voteTarget.index !== undefined && voteTarget.index != i) {
          return voteCommand(i, voteTarget.index);
        }
      }

      // random anyways
      const alivePlayerIndex = this.group_session.players
        .map((p, idx) => {
          if (p.id !== item.id && p.status === "alive") {
            if (item.role.team === "mafia" || item.role.team === "vampire") {
              if (item.role.team !== p.role.team) {
                return idx;
              }
            } else {
              return idx;
            }
          }
        })
        .filter(item => {
          return item !== undefined;
        });

      const randomIndex = util.random(alivePlayerIndex);
      return voteCommand(i, randomIndex);
    }
  }
};

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
    rawArgs = rawArgs.toLowerCase();

    let time = this.group_session.time;
    const state = this.group_session.state;

    if (state !== "idle") {
      if (state !== "new") {
        const players = this.group_session.players;

        if (time === 0) return checkCommand(true);

        const index = indexOfPlayer();
        if (index === -1) return Promise.resolve(null);

        // reset afk if chat on group
        if (players[index].afkCounter > 0) {
          this.group_session.players[index].afkCounter = 0;
        }

        if (state === "day" || state === "vote") {
          for (let i = 0; i < args.length; i++) {
            if (infoWords.includes(args[i].toLowerCase())) {
              return botTellInfo();
            }
          }

          if (rawArgs.toLowerCase() === "siapa mayor") {
            const reveal = util.random([false, false, false, true, false]);
            if (reveal) botMayorReveal();
          }

          const roleName = players[index].role.name;

          // special role yang bisa trigger lewat text biasa
          if (roleName === "mayor" && players[index].status === "alive") {
            if (players[index].role.revealed) return Promise.resolve(null);
            if (rawArgs.includes("mayor")) {
              const subjects = ["aku", "ak", "gw", "gue", "gua", "saya"];

              for (let i = 0; i < subjects.length; i++) {
                if (rawArgs.indexOf(subjects[i]) !== -1) {
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

          // parse bot speak action
          const botNames = util.getFakeData(14).map(item => {
            return item.name.toLowerCase();
          });

          for (let i = 0; i < args.length; i++) {
            for (let u = 0; u < botNames.length; u++) {
              if (botNames[u] === args[i].toLowerCase()) {
                return botSpeakAction(botNames[u]);
              }
            }
          }

          if (state === "vote") {
            return botVote();
          }
        }

        if (time <= 5 && time > 0) {
          let reminder = "💡 Waktu tersisa " + time;
          reminder += " detik lagi, nanti ketik '/cek' ";
          reminder += "saat waktu sudah habis untuk lanjutkan proses. ";
          return replyText(reminder);
        }
      } else {
        let playersLength = this.group_session.players.length;

        if (playersLength < 5) {
          if (time <= 50 && time > 0) {
            let reminder = "💡 Waktu tersisa " + time;
            reminder += " detik lagi. Jika tidak ada yang join, game akan dihentikan";
            return replyText(reminder);
          }
        }
      }
    }

    return Promise.resolve(null);
  }

  const input = args[0].toLowerCase();
  switch (input) {
    case "/new":
    case "/buat":
    case "/main":
    case "/play":
    case "/create":
      return newCommand();
    case "/join":
    case "/j":
      return joinCommand();
    case "/cancel":
    case "/out":
    case "/quit":
    case "/keluar":
    case "/left":
    case "/leave":
      return cancelCommand();
    case "/start":
    case "/mulai":
    case "/gas":
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
    case "/vote_flex":
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
    case "/bye":
    case "/reset":
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
    case "/promote":
      return promoteCommand();
    case "/group":
      return groupCommand();
    case "/rank":
    case "/peringkat":
    case "/ranking":
      return rankCommand();
    case "/me":
      return meCommand();
    case "/sync":
      return updateName();
    case "/addbot":
      return addBotCommand();
    case "/stay":
      return stayCommand();
    default:
      return invalidCommand();
  }
};

const stayCommand = () => {
  if (this.user_session.id !== process.env.DEV_ID) {
    return invalidCommand();
  }

  this.group_session.stay = true;

  return replyText("💡 Bot akan stay disini sementara");
};

const addBotCommand = () => {
  if (this.group_session.state !== "new") {
    let text = "";
    if (this.group_session.state === "idle") {
      text += "💡 Belum ada game yang dibuat, ketik '/new'";
    } else {
      text += "💡 Bot tidak dapat menambah pemain jika game sudah dimulai";
    }
    return replyText(text);
  }

  const playersCount = this.group_session.players.length;

  if (playersCount === 15) {
    return replyText("💡 Room game sudah full!");
  }

  let quantity = this.args[1] || 1;

  if (quantity > 40) {
    const randomBruhImageLink = util.getBruhImage();
    return replyImage(randomBruhImageLink);
  }

  if (isNaN(quantity)) quantity = 1;

  let totalPlayers = playersCount + parseInt(quantity);
  while (totalPlayers > 15) {
    quantity--;
    totalPlayers = playersCount + quantity;
  }

  const dummies = util.getFakeData(14);

  const currentPlayersId = this.group_session.players.map(item => {
    return item.id;
  });

  let cnt = 0;
  for (let i = 0; i < dummies.length; i++) {
    if (cnt == quantity) break;

    if (!currentPlayersId.includes(dummies[i].id)) {
      const newPlayer = createNewPlayer(dummies[i]);
      this.group_session.players.push(newPlayer);
      cnt++;
    }
  }

  const wasHasBot = this.group_session.hasBot;
  this.group_session.hasBot = true;

  let text = `🤖 ${quantity} bot berhasil ditambahkan!`;

  if (!wasHasBot) {
    text += "\n\n" + "💡 Dikarenakan ada bot, maka hasil game tidak akan berpengaruh dengan winrate pemain asli";
  }

  return replyText(text);
};

const updateName = async () => {
  if (indexOfPlayer() !== -1) {
    return replyText("💡 Tidak dapat melakukan sinkronisasi sekarang, lakukan saat tidak berada didalam game");
  }

  const { displayName } = await client.getProfile(this.user_session.id);
  if (this.user_session.name !== displayName) {
    this.user_session.name = displayName;
  }
  const res = await database.updateName(this.user_session.id, displayName);
  return replyText(res);
};

const meCommand = async () => {
  const msg = await util.getSelfData(this.user_session.id);
  if (typeof msg === "string") return replyText(msg);
  return replyFlex(msg);
};

const rankCommand = async () => {
  const flex_text = await util.getRank();
  return replyFlex(flex_text);
};

const groupCommand = () => {
  const msg = util.getPromotedGroup(this.group_sessions);

  if (typeof msg === "string") return replyText(msg);

  return replyFlex(msg);
};

const promoteCommand = () => {
  const place = this.event.source.type;

  if (this.group_session.promoted) {
    return replyText(`💡 ${place} ini telah di promote!`);
  }

  if (this.args.length < 2) {
    return replyText(`💡 Masukkan ID dari admin ${place}!\n\nCth : '/promote tukiman y x g kuy'`);
  }

  this.group_session.promoted = true;
  this.group_session.adminLink = "https://line.me/ti/p/~" + this.args[1];

  function parseToText(arr) {
    let text = "";
    arr.forEach((item, index) => {
      if (index !== 0 && index !== 1) {
        //ini untuk tidak parse text command '/command'
        if (index !== 2) {
          text += " ";
        }
        text += item;
      }
    });

    return text;
  }

  if (this.args.length > 2) {
    this.group_session.caption = parseToText(this.args);
  }

  let text = `📣 ${place} berhasil di promote, cek '/group' untuk listnya. \n\n`;
  text += "Pastikan ID yang dimasukkan benar. ";
  text += `Karena ${place} yang telah didaftar tidak dapat di edit lagi. `;
  text += `${place} yang terdaftar akan dihapus dalam beberapa jam `;
  return replyText(text);
};

const day = () => {
  /// BUAT MASING" SYSTEM UNTUK DAY FUNC
  let flex_texts = [];
  this.group_session.state = "day";
  let players = this.group_session.players;

  this.group_session.players.forEach(item => {
    if (item.status === "alive") {
      // reset alive player message
      if (item.message) {
        item.message = "";
      }

      // check afk
      const noSkillRoles = ["villager", "jester", "executioner", "mayor", "psychic"];

      if (!noSkillRoles.includes(item.role.name)) {
        if (item.target.index === -1) {
          let isFullMoon = this.group_session.isFullMoon;
          let roleName = item.role.name;
          if (!isFullMoon) {
            if (roleName !== "werewolf" && roleName !== "juggernaut") {
              item.afkCounter++;
            } else if (roleName === "juggernaut") {
              if (item.role.skillLevel > 0) {
                item.afkCounter++;
              }
            }
          } else {
            item.afkCounter++;
          }
        } else {
          item.afkCounter = 0;
        }
      }
    }
  });

  let allAnnouncement = "";
  let vampireAnnouncement = "";
  let mafiaAnnouncement = "";
  let plaguebearerAnnouncement = "";
  let arsonistAnnouncement = {};

  /// Veteran targetIndexes
  let veteranTargetIndexes = [];

  /// Spy global var
  let spyMafiaVisitInfo = "";
  let spyBuggedInfo = {};

  /// Reserved Announcement
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    // Spy lock target action
    if (doer.role.name === "spy" && doer.status === "alive") {
      const targetIndex = doer.target.index;

      if (targetIndex !== -1) {
        this.group_session.players[targetIndex].bugged = true;
        spyBuggedInfo[targetIndex] = "";
      }
    }

    if (doer.role.name === "arsonist" && doer.status === "alive") {
      arsonistAnnouncement[i] = "";
    }
  }

  /// Vampire Action
  // search the vampire that responsible to bite
  // note: the youngest
  let vampireExists = checkExistsRole("vampire");
  let vampireAttackMode = false;
  let vampires = [];
  let vampireDoerIndex = -1;

  if (vampireExists) {
    // reset vampire convert cooldown
    if (this.group_session.vampireConvertCooldown > 0) {
      this.group_session.vampireConvertCooldown = 0;
    }

    players.forEach((item, index) => {
      if (item.role.team === "vampire" && item.status === "alive") {
        let vampire = {
          index: index,
          age: item.role.age
        };
        vampires.push(vampire);
      }
    });

    if (vampires.length >= 4) {
      vampireAttackMode = true;
    }

    let tmp = vampires[0].age;
    vampireDoerIndex = vampires[0].index;

    for (let i = 0; i < vampires.length; i++) {
      if (vampires[i].age < tmp) {
        tmp = vampires[i].age;
        vampireDoerIndex = vampires[i].index;
      }
    }

    let vampireCandidates = [];
    players.forEach(item => {
      if (item.role.name === "vampire" && item.status === "alive" && item.target.index !== -1) {
        vampireCandidates.push(item.target.index);
        if (item.target.value > 1) {
          vampireCandidates.push(item.target.index);
        }
      }
    });

    if (vampireCandidates.length > 0) {
      let vampireChosenTarget = util.getMostFrequent(vampireCandidates);

      if (vampireCandidates.length === 1) {
        vampireChosenTarget = {
          index: vampireCandidates[0]
        };
      } else {
        if (vampireChosenTarget.index === undefined) {
          util.shuffleArray(vampireCandidates);
          vampireChosenTarget = {
            index: vampireCandidates[0]
          };
          vampireAnnouncement += "🦇 Para Vampire memiliki target yang berbeda, sehingga random pilih" + "\n\n";
        }
      }

      this.group_session.players[vampireDoerIndex].target.index = vampireChosenTarget.index;
    } else {
      this.group_session.players[vampireDoerIndex].target.index = -1;
    }
  }

  /// Mafia Action
  // search the mafia that responsible to bite
  // note: the mafioso if possible, if there is none, godfather itself
  let mafiaKillingExists = checkExistsRole("godfather") || checkExistsRole("mafioso");
  let mafiaDoerIndex = -1;

  // ini biasa godfather langsung, soalnya bisa aja mafioso di block / MATI
  let mafiaDoerBackupIndex = -1;

  // isUseSkill for ww
  let isMainMafiaUseSkill = false;
  let isBackupMafiaUseSkill = false;

  if (mafiaKillingExists) {
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];
      let status = doer.status;
      let roleName = doer.role.name;
      if (roleName === "mafioso" && status === "alive") {
        mafiaDoerIndex = i;
        if (doer.target.index !== -1) {
          isMainMafiaUseSkill = true;
        }
        break;
      }
    }

    for (let i = 0; i < players.length; i++) {
      const doer = players[i];
      const roleName = doer.role.name;
      if (roleName === "godfather" && doer.status === "alive") {
        mafiaDoerBackupIndex = i;
        if (doer.target.index !== -1) {
          isBackupMafiaUseSkill = true;
        }
        break;
      }
    }

    // check skill nya dipake atau engga
    if (isBackupMafiaUseSkill && mafiaDoerIndex === -1) {
      mafiaDoerIndex = mafiaDoerBackupIndex;
    }

    if (!isMainMafiaUseSkill && !isBackupMafiaUseSkill) {
      for (let i = 0; i < players.length; i++) {
        const doer = players[i];
        const roleName = doer.role.name;
        if (roleName === "mafioso" || roleName === "godfather") {
          this.group_session.players[i].message += "💡 Kamu tidak menggunakan skill mu" + "\n\n";
        }
      }
    } else {
      let mafiaCandidates = [];
      players.forEach(item => {
        if (
          item.status === "alive" &&
          (item.role.name === "godfather" || item.role.name === "mafioso") &&
          item.target.index !== -1
        ) {
          mafiaCandidates.push(item.target.index);
          if (item.target.value > 1) {
            mafiaCandidates.push(item.target.index);
          }
        }
      });

      if (mafiaCandidates.length > 0) {
        let mafiaChosenTarget = util.getMostFrequent(mafiaCandidates);

        if (mafiaCandidates.length === 1) {
          mafiaChosenTarget = {
            index: mafiaCandidates[0]
          };
        } else {
          if (mafiaChosenTarget.index === undefined) {
            util.shuffleArray(mafiaCandidates);
            mafiaChosenTarget = {
              index: mafiaCandidates[0]
            };
            mafiaAnnouncement += "🤵 Para Mafia memiliki target yang berbeda, sehingga random pilih" + "\n\n";
          }
        }

        this.group_session.players[mafiaDoerIndex].target.index = mafiaChosenTarget.index;

        const doer = players[mafiaDoerIndex];
        const target = players[mafiaChosenTarget.index];
        mafiaAnnouncement += `🤵 ${doer.name} akan membunuh ${target.name}\n\n`;
      }
    }
  }

  /// Not use skill message
  const basicNotUseSkillRole = [
    "disguiser",
    "escort",
    "consort",
    "veteran",
    "arsonist",
    "retributionist",
    "guardian-angel",
    "doctor",
    "bodyguard",
    "survivor",
    "vampire-hunter",
    "vigilante",
    "serial-killer",
    "arsonist",
    "framer",
    "investigator",
    "consigliere",
    "sheriff",
    "spy",
    "tracker",
    "lookout",
    "amnesiac"
  ];

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const targetIndex = player.target.index;
    if (player.status === "alive" && targetIndex === -1) {
      if (basicNotUseSkillRole.includes(player.role.name)) {
        this.group_session.players[i].message += "💡 Kamu tidak menggunakan skill mu" + "\n\n";
      }
    }
  }

  /// Escort Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.role.name === "escort" && doer.status === "alive") {
      if (doer.target.index === -1 || doer.attacked) {
        continue;
      }

      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";

      const visitor = {
        index: i,
        name: doer.name,
        role: doer.role
      };
      this.group_session.players[targetIndex].visitors.push(visitor);

      checkInfection(i, targetIndex);

      const immuneToRoleBlock = ["escort", "consort", "veteran"];

      if (players[targetIndex].role.name === "plaguebearer") {
        if (players[targetIndex].role.isPestilence) {
          immuneToRoleBlock.push("plaguebearer");
        }
      }

      if (this.group_session.isFullMoon) {
        immuneToRoleBlock.push("werewolf");
      }

      if (target.role.name === "serial-killer") {
        this.group_session.players[i].message += "💡 Targetmu immune dari role block!" + "\n\n";

        this.group_session.players[targetIndex].message += "💡 Ada yang berusaha role block kamu!" + "\n\n";

        this.group_session.players[targetIndex].intercepted = true;

        this.group_session.players[targetIndex].target.index = i;

        if (players[targetIndex].bugged) {
          spyBuggedInfo[targetIndex] +=
            "🔍 Ada yang mencoba roleblock Target kamu, hingga Targetmu menyerang nya!" + "\n\n";
        }
      } else if (immuneToRoleBlock.includes(target.role.name)) {
        this.group_session.players[i].message += "💡 Targetmu immune dari role block!" + "\n\n";

        this.group_session.players[targetIndex].message += "💡 Ada yang berusaha role block kamu!" + "\n\n";

        if (players[targetIndex].bugged) {
          spyBuggedInfo[targetIndex] +=
            "🔍 Ada yang mencoba roleblock Target kamu tapi targetmu immune dari roleblock!" + "\n\n";
        }
      } else {
        this.group_session.players[targetIndex].blocked = true;

        if (players[targetIndex].bugged) {
          spyBuggedInfo[targetIndex] += "🔍 Target kamu di roleblock sehingga dia diam dirumah saja!" + "\n\n";
        }

        /// langsung kasih pesannya aja
        if (targetIndex === mafiaDoerIndex) {
          if (isBackupMafiaUseSkill) {
            this.group_session.players[mafiaDoerIndex].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." + "\n\n";
          }
        }
      }
    }
  }

  /// Consort Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.role.name === "consort" && doer.status === "alive") {
      if (doer.target.index === -1 || doer.attacked) {
        continue;
      }

      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";

      mafiaAnnouncement += `🚷 ${doer.name} berencana block skill ${target.name}\n\n`;

      const visitor = {
        index: i,
        name: doer.name,
        role: doer.role
      };
      this.group_session.players[targetIndex].visitors.push(visitor);

      checkInfection(i, targetIndex);

      const immuneToRoleBlock = ["escort", "consort", "veteran"];

      if (players[targetIndex].role.name === "plaguebearer") {
        if (players[targetIndex].role.isPestilence) {
          immuneToRoleBlock.push("plaguebearer");
        }
      }

      if (this.group_session.isFullMoon) {
        immuneToRoleBlock.push("werewolf");
      }

      if (target.role.name === "serial-killer") {
        this.group_session.players[i].message += "💡 Targetmu immune dari role block!" + "\n\n";

        this.group_session.players[targetIndex].message += "💡 Ada yang berusaha role block kamu!" + "\n\n";

        this.group_session.players[targetIndex].intercepted = true;

        this.group_session.players[targetIndex].target.index = i;

        if (players[targetIndex].bugged) {
          spyBuggedInfo[targetIndex] +=
            "🔍 Ada yang mencoba roleblock Target kamu, hingga Targetmu menyerang nya!" + "\n\n";
        }
      } else if (immuneToRoleBlock.includes(target.role.name)) {
        this.group_session.players[i].message += "💡 Targetmu immune dari role block!" + "\n\n";

        this.group_session.players[targetIndex].message += "💡 Ada yang berusaha role block kamu!" + "\n\n";

        if (players[targetIndex].bugged) {
          spyBuggedInfo[targetIndex] +=
            "🔍 Ada yang mencoba roleblock Target kamu tapi targetmu immune dari roleblock!" + "\n\n";
        }
      } else {
        this.group_session.players[targetIndex].blocked = true;

        if (target.role.name !== "veteran" || target.target.index === -1) {
          spyMafiaVisitInfo += `🤵 ${target.name} dikunjungi anggota Mafia\n\n`;
        }

        if (players[targetIndex].bugged) {
          spyBuggedInfo[targetIndex] += "🔍 Target kamu di roleblock sehingga dia diam dirumah saja!" + "\n\n";
        }

        /// langsung kasih pesannya aja
        if (targetIndex === mafiaDoerIndex) {
          if (isBackupMafiaUseSkill) {
            this.group_session.players[mafiaDoerIndex].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." + "\n\n";
          }
        }
      }
    }
  }

  /// Mafia blocking checker
  if (isMainMafiaUseSkill || isBackupMafiaUseSkill) {
    let wasMafiaDoer = players[mafiaDoerIndex];
    if (wasMafiaDoer.blocked) {
      let pastTargetIndex = wasMafiaDoer.target.index;

      if (isBackupMafiaUseSkill && mafiaDoerBackupIndex !== -1) {
        mafiaDoerIndex = mafiaDoerBackupIndex;
        this.group_session.players[mafiaDoerIndex].target.index = pastTargetIndex;
      }
    }
  }

  /// Role Blocked message
  for (let i = 0; i < players.length; i++) {
    if (players[i].status === "alive" && players[i].blocked) {
      this.group_session.players[i].message += "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." + "\n\n";
    }
  }

  /// Disguiser Action
  // jangan dipindah di bawah veteran
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.blocked) continue;

    if (doer.role.name === "disguiser" && doer.status === "alive") {
      if (doer.target.index === -1 || doer.attacked) {
        continue;
      }

      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";

      mafiaAnnouncement += `🎭 ${doer.name} akan mengimitasi role ${target.name}\n\n`;

      // hax for check if the target was veteran
      if (target.role.name === "veteran" && target.target.index !== -1) {
        continue;
      }

      const visitor = {
        index: i,
        name: doer.name,
        role: doer.role
      };
      this.group_session.players[targetIndex].visitors.push(visitor);

      checkInfection(i, targetIndex);

      this.group_session.players[i].role.disguiseAs = target.role.name;

      if (target.role.name !== "veteran" || target.target.index === -1) {
        spyMafiaVisitInfo += `🤵 ${target.name} dikunjungi anggota Mafia\n\n`;
      }
    }
  }

  /// Vampire Action
  // jangan dipindah di bawah veteran
  for (let i = 0; i < players.length; i++) {
    if (vampireDoerIndex === i) {
      const doer = players[i];
      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      if (doer.status === "alive" && targetIndex !== -1) {
        vampireAnnouncement += `🧛 ${doer.name} yang akan ke rumah ${target.name}\n\n`;

        if (doer.blocked === true) {
          this.group_session.players[i].message +=
            "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." + "\n\n";

          break;
        } else if (!doer.attacked) {
          // hax for check if the target was veteran
          if (target.role.name === "veteran" && target.target.index !== -1) {
            break;
          }

          let visitor = {
            index: i,
            name: doer.name,
            role: doer.role
          };
          this.group_session.players[targetIndex].visitors.push(visitor);

          checkInfection(i, targetIndex);

          vampireAnnouncement += `🧛 Target Vampire adalah ${target.name}\n\n`;

          // hax for vampire if it only one vampire
          if (vampires.length === 1) {
            this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";
          } else {
            this.group_session.players[i].message += "👣 Kamu disuruh ke rumah " + target.name + "\n\n";
          }

          vampireAnnouncement += `👣 ${doer.name} mengunjungi rumah ${target.name}\n\n`;

          this.group_session.players[targetIndex].message += "🧛 Kamu didatangi Vampire!" + "\n\n";

          let targetRoleName = target.role.name;

          if (target.role.isDisguiseAs) targetRoleName = "disguiser";

          const immuneToVampireBite = [
            "godfather",
            "vampire-hunter",
            "serial-killer",
            "arsonist",
            "executioner",
            "werewolf",
            "plaguebearer"
          ];

          const canAttacked = [
            "mafioso",
            "consigliere",
            "consort",
            "framer",
            "disguiser",
            "juggernaut",
            "guardian-angel"
          ];

          if (immuneToVampireBite.includes(targetRoleName)) {
            this.group_session.players[i].message += "💡 Target kamu kebal dari gigitan!" + "\n\n";

            this.group_session.players[targetIndex].message +=
              "💡 Ada yang menyerang kamu tapi pertahanan mu lebih tinggi dari serangan!" + "\n\n";

            if (players[targetIndex].bugged) {
              spyBuggedInfo[targetIndex] += "🔍 Target kamu diserang tapi serangan tersebut tidak mempan!" + "\n\n";
            }

            if (targetRoleName === "vampire-hunter") {
              this.group_session.players[targetIndex].intercepted = true;

              this.group_session.players[targetIndex].target.index = i;
            }
          } else if (canAttacked.includes(targetRoleName) || vampireAttackMode) {
            if (target.role.name === "juggernaut") {
              if (target.role.skillLevel >= 2) {
                this.group_session.players[i].message += "💡 Target kamu kebal dari gigitan!" + "\n\n";

                this.group_session.players[targetIndex].message +=
                  "💡 Ada yang menyerang kamu tapi pertahanan mu lebih tinggi dari serangan!" + "\n\n";

                if (players[targetIndex].bugged) {
                  spyBuggedInfo[targetIndex] += "🔍 Target kamu diserang tapi serangan tersebut tidak mempan!" + "\n\n";
                }

                break;
              }
            }

            this.group_session.players[i].message += "💡 Kamu menyerang " + target.name + "\n\n";

            this.group_session.players[targetIndex].message += "🧛 Kamu diserang " + doer.role.name + "!" + "\n\n";

            if (players[targetIndex].bugged) {
              spyBuggedInfo[targetIndex] += "🔍 Target kamu di serang Vampire!" + "\n\n";
            }

            this.group_session.players[targetIndex].attacked = true;

            const attacker = {
              index: i,
              name: doer.name,
              role: doer.role,
              deathNote: doer.deathNote,
              countered: false
            };

            this.group_session.players[targetIndex].attackers.push(attacker);
          } else {
            this.group_session.players[i].message += "💡 Kamu gigit " + target.name + "\n\n";

            if (players[targetIndex].bugged) {
              spyBuggedInfo[targetIndex] += "🔍 Target kamu digigit Vampire!" + "\n\n";
            }

            this.group_session.players[targetIndex].vampireBited = true;

            const attacker = {
              index: i,
              name: doer.name,
              role: doer.role,
              deathNote: doer.deathNote,
              countered: false
            };

            this.group_session.players[targetIndex].attackers.push(attacker);
          }
        }
      }
    }
  }

  /// Plaguebearer action : Pestilence
  for (let i = 0; i < players.length; i++) {
    let doer = players[i];
    let roleName = doer.role.name;
    let targetIndex = doer.target.index;

    if (doer.blocked) continue;

    if (roleName === "plaguebearer" && doer.status === "alive") {
      if (!doer.role.isPestilence) continue;

      let pestilenceRampageTargetIndexes = [];
      let rampagePlaceIndex = targetIndex;

      if (targetIndex != -1) {
        pestilenceRampageTargetIndexes.push(targetIndex);

        this.group_session.players[i].message +=
          "👣 Kamu ke rumah " + players[targetIndex].name + " dan RAMPAGE di rumahnya" + "\n\n";
      } else if (targetIndex == i || targetIndex === -1) {
        rampagePlaceIndex = i;
        this.group_session.players[i].message += "👣 Kamu diam di rumah dan akan menyerang siapa yang datang" + "\n\n";
      }

      for (let i = 0; i < players.length; i++) {
        if (i == targetIndex) continue;

        let visitor = players[i];

        if (visitor == doer) continue;

        if (visitor.status !== "alive") continue;

        if (visitor.blocked) continue;

        if (visitor.target.index == rampagePlaceIndex) {
          // hax mafia kalo yang pergi itu mafioso
          if (visitor.role.name === "godfather") {
            if (mafiaDoerIndex !== i) continue;
          }

          if (visitor.role.name === "vampire") {
            if (vampireDoerIndex !== i) continue;
          }

          pestilenceRampageTargetIndexes.push(i);
        }
      }

      // Plaguebearer Killing Action
      for (let u = 0; u < pestilenceRampageTargetIndexes.length; u++) {
        const targetIndex = pestilenceRampageTargetIndexes[u];

        this.group_session.players[i].message += "💡 Kamu menyerang seseorang!" + "\n\n";

        if (players[targetIndex].bugged) {
          spyBuggedInfo[targetIndex] += "🔍 Target kamu merasakan kesakitan karena terinfeksi!" + "\n\n";
        }

        this.group_session.players[targetIndex].message += "☣️ Kamu merasa sakit, dan sepertinya terinfeksi!" + "\n\n";

        this.group_session.players[targetIndex].attacked = true;

        const attacker = {
          index: i,
          name: doer.name,
          role: doer.role,
          deathNote: doer.deathNote,
          countered: false
        };

        this.group_session.players[targetIndex].attackers.push(attacker);
      }
    }
  }

  /// Juggernaut Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];
    const roleName = doer.role.name;
    const targetIndex = doer.target.index;

    if (roleName === "juggernaut" && doer.status === "alive") {
      const skillLevel = doer.role.skillLevel;
      if (!this.group_session.isFullMoon && skillLevel === 0) continue;

      if (doer.blocked) {
        this.group_session.players[i].message += "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." + "\n\n";

        continue;
      }

      if (doer.target.index !== -1) {
        const target = players[targetIndex];

        if (skillLevel < 3) {
          // hax for check if the target was veteran
          if (target.role.name === "veteran" && target.target.index !== -1) {
            continue;
          }
        }

        const visitor = {
          index: i,
          name: doer.name,
          role: doer.role
        };
        this.group_session.players[targetIndex].visitors.push(visitor);

        checkInfection(i, targetIndex);

        this.group_session.players[i].message += "👣 Kamu ke rumah " + players[targetIndex].name;

        if (skillLevel > 2) {
          this.group_session.players[i].message += " dan RAMPAGE di rumahnya" + "\n\n";
        } else {
          this.group_session.players[i].message += "\n\n";
        }
      }

      const immuneToBasicAttack = ["serial-killer", "arsonist", "godfather", "executioner"];

      if (this.group_session.isFullMoon) {
        immuneToBasicAttack.push("werewolf");
      }

      /// skill level 0
      if (skillLevel < 3) {
        // kalau udah skill level 3, itu diam di rmh rampage sendiri
        if (doer.target.index === -1) {
          this.group_session.players[i].message += "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          // skill level 0 dan 1

          if (immuneToBasicAttack.includes(players[targetIndex].role.name)) {
            this.group_session.players[i].message += "💡 Pertahanan targetmu terlalu tinggi untuk dibunuh!" + "\n\n";

            this.group_session.players[targetIndex].message +=
              "💡 Ada yang menyerang kamu tapi pertahanan mu lebih tinggi dari serangan!" + "\n\n";

            if (players[targetIndex].bugged) {
              spyBuggedInfo[targetIndex] += "🔍 Target kamu di serang tapi serangan tersebut tidak mempan!" + "\n\n";
            }
          } else {
            this.group_session.players[i].message += "💡 Kamu menyerang " + players[targetIndex].name + "\n\n";

            if (players[targetIndex].bugged) {
              spyBuggedInfo[targetIndex] += "🔍 Target kamu di serang Juggernaut!" + "\n\n";
            }

            this.group_session.players[targetIndex].message += "💪 Kamu diserang " + roleName + "!" + "\n\n";

            this.group_session.players[targetIndex].attacked = true;

            const attacker = {
              index: i,
              name: doer.name,
              role: doer.role,
              deathNote: doer.deathNote,
              countered: false
            };

            this.group_session.players[targetIndex].attackers.push(attacker);
          }
        }
      } else {
        // skill level 3 dan 4
        let juggernautRampageTargetIndexes = [];
        let rampagePlaceIndex = targetIndex;

        if (targetIndex != -1) {
          juggernautRampageTargetIndexes.push(targetIndex);
        } else if (targetIndex == i || targetIndex === -1) {
          rampagePlaceIndex = i;
          this.group_session.players[i].message +=
            "👣 Kamu diam di rumah dan akan menyerang siapa yang datang" + "\n\n";
        }

        for (let i = 0; i < players.length; i++) {
          if (i == targetIndex) continue;

          let visitor = players[i];

          if (visitor == doer) continue;

          if (visitor.status !== "alive") continue;

          if (visitor.blocked) continue;

          if (visitor.target.index == rampagePlaceIndex) {
            // hax mafia kalo yang pergi itu mafioso
            if (visitor.role.name === "godfather") {
              if (mafiaDoerIndex !== i) continue;
            }

            if (visitor.role.name === "vampire") {
              if (vampireDoerIndex !== i) continue;
            }

            if (visitor.role.name === "plaguebearer") {
              if (visitor.role.isPestilence) continue;
            }

            juggernautRampageTargetIndexes.push(i);
          }
        }

        // Juggernaut Killing Action
        for (let u = 0; u < juggernautRampageTargetIndexes.length; u++) {
          let targetIndex = juggernautRampageTargetIndexes[u];

          if (skillLevel < 4) {
            let targetRoleName = players[targetIndex].role.name;

            let isAlertVeteran = false;
            if (players[targetIndex].role.name === "veteran") {
              if (players[targetIndex].target.index !== -1) {
                isAlertVeteran = true;
              }
            }

            let isTargetImmune = immuneToBasicAttack.includes(targetRoleName) ? true : false;

            if (isTargetImmune || isAlertVeteran) {
              this.group_session.players[i].message +=
                "💡 Kamu menyerang seseorang tapi pertahanannya lebih tinggi dari seranganmu!" + "\n\n";

              this.group_session.players[targetIndex].message +=
                "💡 Ada yang menyerang kamu tapi pertahanan mu lebih tinggi dari serangan!" + "\n\n";

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] += "🔍 Target kamu di serang tapi serangan tersebut tidak mempan!" + "\n\n";
              }
              continue;
            }
          }

          this.group_session.players[i].message += "💡 Kamu menyerang seseorang!" + "\n\n";

          if (players[targetIndex].bugged) {
            spyBuggedInfo[targetIndex] += "🔍 Target kamu di serang Juggernaut!" + "\n\n";
          }

          this.group_session.players[targetIndex].message += "💪 Kamu diserang " + roleName + "!" + "\n\n";

          this.group_session.players[targetIndex].attacked = true;

          const attacker = {
            index: i,
            name: doer.name,
            role: doer.role,
            deathNote: doer.deathNote,
            countered: false
          };

          this.group_session.players[targetIndex].attackers.push(attacker);
        }
      }
    }
  }

  /// Werewolf Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];
    const roleName = doer.role.name;
    const targetIndex = doer.target.index;

    if (roleName === "werewolf" && doer.status === "alive") {
      if (!this.group_session.isFullMoon) continue;

      const werewolfRampageTargetIndexes = [];
      let rampagePlaceIndex = targetIndex;

      if (i != targetIndex && targetIndex != -1) {
        werewolfRampageTargetIndexes.push(targetIndex);
        const visitor = {
          index: i,
          name: doer.name,
          role: doer.role
        };
        this.group_session.players[targetIndex].visitors.push(visitor);

        checkInfection(i, targetIndex);

        this.group_session.players[i].message +=
          "👣 Kamu ke rumah " + players[targetIndex].name + " dan RAMPAGE di rumahnya" + "\n\n";
      } else if (targetIndex == i || targetIndex === -1) {
        rampagePlaceIndex = i;
        this.group_session.players[i].message += "👣 Kamu diam di rumah dan akan menyerang siapa yang datang" + "\n\n";
      }

      for (let i = 0; i < players.length; i++) {
        if (i == targetIndex) continue;

        let visitor = players[i];

        if (visitor == doer) continue;

        if (visitor.status !== "alive") continue;

        if (visitor.blocked) continue;

        if (visitor.role.name === "plaguebearer") {
          if (visitor.role.isPestilence) continue;
        }

        if (visitor.target.index == rampagePlaceIndex) {
          // hax mafia kalo yang pergi itu mafioso
          if (visitor.role.name === "godfather") {
            if (mafiaDoerIndex !== i) continue;
          }

          if (visitor.role.name === "vampire") {
            if (vampireDoerIndex !== i) continue;
          }

          werewolfRampageTargetIndexes.push(i);
        }
      }

      // Werewolf Killing Action
      for (let u = 0; u < werewolfRampageTargetIndexes.length; u++) {
        const targetIndex = werewolfRampageTargetIndexes[u];

        this.group_session.players[i].message += "💡 Kamu menyerang seseorang!" + "\n\n";

        if (players[targetIndex].bugged) {
          spyBuggedInfo[targetIndex] += "🔍 Target kamu di serang Werewolf!" + "\n\n";
        }

        this.group_session.players[targetIndex].message += "🐺 Kamu diserang " + roleName + "!" + "\n\n";

        this.group_session.players[targetIndex].attacked = true;

        const attacker = {
          index: i,
          name: doer.name,
          role: doer.role,
          deathNote: doer.deathNote,
          countered: false
        };

        this.group_session.players[targetIndex].attackers.push(attacker);
      }
    }
  }

  /// Veteran Visitor fetch
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.status === "alive" && doer.target.index !== -1) {
      if (doer.target.index != i) {
        const targetIndex = doer.target.index;
        const target = players[targetIndex];

        if (doer.role.name === "jester") continue;

        if (doer.blocked) continue;

        if (doer.role.name === "plaguebearer") {
          if (doer.role.isPestilence) continue;
        }

        if (target.role.name === "veteran") {
          if (target.target.index === -1) continue;

          // hax untuk Mafia yang tukang bunuh bukan godfather, tapi mafioso
          // juga vampire yang pergi 1 aja
          if (doer.role.name === "godfather") {
            if (mafiaDoerIndex !== i) continue;
          }

          if (doer.role.name === "vampire") {
            if (vampireDoerIndex !== i) continue;
          }

          // hax buat spy mafia visit info
          if (doer.role.team === "mafia") {
            spyMafiaVisitInfo += `🤵 ${target.name} dikunjungi anggota Mafia\n\n`;
          }

          veteranTargetIndexes.push({
            index: i,
            isVisitor: true
          });
        }
      }
    }
  }

  /// Veteran Action
  for (let i = 0; i < players.length; i++) {
    let doer = players[i];
    let roleName = doer.role.name;
    let status = doer.status;
    let isUseSkill = false;
    if (doer.target.index !== -1) {
      isUseSkill = true;
    }

    if (roleName === "veteran" && status === "alive") {
      if (!isUseSkill) {
        continue;
      } else {
        let targetIndexes = veteranTargetIndexes;

        this.group_session.players[i].role.alert--;

        for (let u = 0; u < targetIndexes.length; u++) {
          const targetIndex = targetIndexes[u].index;
          const target = players[targetIndex];
          const targetRoleName = target.role.name;
          const isVisitor = targetIndexes[u].isVisitor;

          if (isVisitor) {
            this.group_session.players[i].message += "💡 Ada yang datang mengunjungi kamu!" + "\n\n";

            // hax karna ada sebagian role yang sudah masukkin data visitor ke veteran
            const alreadyVisit = ["escort", "consort", "werewolf", "juggernaut"];

            if (!alreadyVisit.includes(targetRoleName)) {
              this.group_session.players[targetIndex].message += "👣 Kamu ke rumah " + doer.name + "\n\n";

              const visitor = {
                index: i,
                name: target.name,
                role: target.role
              };
              this.group_session.players[i].visitors.push(visitor);

              checkInfection(i, targetIndex);
            }
          }

          if (players[targetIndex].bugged) {
            spyBuggedInfo[targetIndex] += "🔍 Target kamu di serang Veteran yang dia kunjungi!" + "\n\n";
          }

          this.group_session.players[targetIndex].message +=
            "💥 Kamu diserang " + roleName + " yang kamu kunjungi!" + "\n\n";

          this.group_session.players[targetIndex].attacked = true;

          const attacker = {
            index: i,
            name: doer.name,
            role: doer.role,
            deathNote: doer.deathNote,
            countered: false
          };

          this.group_session.players[targetIndex].attackers.push(attacker);
        }
      }
    }
  }

  /// Arsonist Douse Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];
    const roleName = doer.role.name;
    const targetIndex = doer.target.index;

    if (doer.blocked) continue;

    if (roleName === "arsonist" && doer.status === "alive") {
      if (doer.target.index === -1 || doer.attacked) {
        continue;
      }

      if (targetIndex == i) continue;

      const target = players[targetIndex];

      this.group_session.players[targetIndex].doused = true;

      if (players[targetIndex].bugged) {
        spyBuggedInfo[targetIndex] += "🔍 Target kamu disiram bensin oleh Arsonist!" + "\n\n";
      }

      this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";

      const visitor = {
        index: i,
        name: doer.name,
        role: doer.role
      };
      this.group_session.players[targetIndex].visitors.push(visitor);

      checkInfection(i, targetIndex);

      this.group_session.players[i].message += "⛽ Kamu diam diam menyiram bensin ke rumah " + target.name + "\n\n";
    }
  }

  /// Plaguebearer action : infect
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];
    const roleName = doer.role.name;
    const targetIndex = doer.target.index;

    if (doer.blocked) continue;

    if (roleName === "plaguebearer" && doer.status === "alive") {
      if (doer.role.isPestilence) continue;

      if (doer.target.index === -1 || doer.attacked) {
        continue;
      }

      const target = players[targetIndex];

      this.group_session.players[targetIndex].justInfected = true;

      this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";

      const visitor = {
        index: i,
        name: doer.name,
        role: doer.role
      };
      this.group_session.players[targetIndex].visitors.push(visitor);

      this.group_session.players[i].message += `☣️ Kamu akan menginfeksi ${target.name}\n\n`;
    }
  }

  /// Jester Haunt Action
  for (let i = 0; i < players.length; i++) {
    let doer = players[i];

    if (doer.role.name === "jester") {
      if (doer.role.isLynched && !doer.role.hasRevenged) {
        let targetIndex = -1;

        if (doer.target.index === -1) {
          // random kill
          this.group_session.players[i].message +=
            "💡 Karena kamu tidak pilih target, kamu akan sembarangan menghantui orang" + "\n\n";

          targetIndex = getJesterTargetIndex(doer.id);
        } else {
          targetIndex = doer.target.index;
        }

        this.group_session.players[targetIndex].message +=
          "👻 SURPRISEEE!! Kamu didatangi 🤡 Jester yang mati itu" + "\n\n";

        if (players[targetIndex].bugged) {
          spyBuggedInfo[targetIndex] += "🔍 Target kamu di hantui Jester!" + "\n\n";
        }

        this.group_session.players[targetIndex].attacked = true;
        this.group_session.players[targetIndex].isHaunted = true;

        const attacker = {
          index: i,
          name: doer.name,
          role: doer.role,
          deathNote: doer.deathNote,
          countered: false
        };

        this.group_session.players[targetIndex].attackers.push(attacker);

        this.group_session.players[i].role.hasRevenged = true;

        this.group_session.players[i].message +=
          "👻 Kamu menghantui " + players[targetIndex].name + " sampai dia mati ketakutan" + "\n\n";
      }
    }
  }

  /// Retributionist Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.blocked) continue;

    if (doer.role.name === "retributionist" && doer.status === "alive") {
      if (doer.target.index === -1) {
        continue;
      }

      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      this.group_session.players[i].role.revive--;

      this.group_session.players[targetIndex].status = "alive";
      this.group_session.players[targetIndex].attacked = false;
      this.group_session.players[targetIndex].attackers = [];
      this.group_session.players[targetIndex].vampireBited = false;
      this.group_session.players[targetIndex].message = "";
      this.group_session.players[targetIndex].healed = false;
      this.group_session.players[targetIndex].bugged = false;
      this.group_session.players[targetIndex].vested = false;
      this.group_session.players[targetIndex].visitors = [];
      this.group_session.players[targetIndex].blocked = false;
      this.group_session.players[targetIndex].targetVoteIndex = -1;
      this.group_session.players[targetIndex].intercepted = false;
      this.group_session.players[targetIndex].target = {
        index: -1,
        value: 1
      };
      this.group_session.players[targetIndex].willSuicide = false;
      this.group_session.players[targetIndex].framed = false;
      this.group_session.players[targetIndex].protectors = [];
      this.group_session.players[targetIndex].guarded = false;
      this.group_session.players[targetIndex].selfHeal = false;
      this.group_session.players[targetIndex].damage = 0;

      let targetRoleName = target.role.name;

      if (target.role.disguiseAs) {
        targetRoleName = target.role.disguiseAs;
      }

      this.group_session.players[i].message +=
        "⚰️ Kamu berhasil membangkitkan " + target.name + " (" + targetRoleName + ")" + "\n\n";

      this.group_session.players[targetIndex].message += "⚰️ Kamu berhasil dibangkitkan Retributionist!" + "\n\n";

      allAnnouncement += `⚰️ ${target.name} (${targetRoleName}) bangkit dari kematian!\n\n`;
    }
  }

  /// Guardian Angel Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.blocked) continue;

    if (doer.role.name === "guardian-angel") {
      if (doer.target.index === -1) continue;

      let targetIndex = doer.target.index;

      const isHaunted = players[targetIndex].isHaunted;
      const willSuicide = players[targetIndex].willSuicide;
      const afkCounter = players[targetIndex].afkCounter;

      this.group_session.players[i].role.protection--;
      this.group_session.players[targetIndex].protected = true;

      this.group_session.players[targetIndex].doused = false;
      this.group_session.players[targetIndex].framed = false;
      this.group_session.players[targetIndex].infected = false;
      this.group_session.players[targetIndex].vampireBited = false;

      this.group_session.players[i].message += `⚔️ Kamu menjaga ${players[targetIndex].name}\n\n`;

      this.group_session.players[targetIndex].message += "⚔️ Kamu diawasi oleh Guardian Angel!" + "\n\n";

      let protector = {
        index: i,
        roleName: doer.role.name,
        used: false
      };

      this.group_session.players[targetIndex].protectors.push(protector);

      if (!isHaunted && !willSuicide && afkCounter < 3) {
        allAnnouncement += `⚔️ Guardian Angel melindungi ${players[targetIndex].name}!\n\n`;
      }
    }
  }

  /// Doctor Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.blocked) continue;

    if (doer.role.name === "doctor" && doer.status === "alive") {
      if (doer.target.index === -1 || doer.attacked) {
        continue;
      }

      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      if (targetIndex == i) {
        this.group_session.players[i].message += "🏠 Kamu memilih diam di rumah dan jaga-jaga" + "\n\n";

        this.group_session.players[i].role.selfHeal--;

        this.group_session.players[i].selfHeal = true;
      } else {
        const visitor = {
          index: i,
          name: doer.name,
          role: doer.role
        };

        this.group_session.players[targetIndex].visitors.push(visitor);

        checkInfection(i, targetIndex);

        this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";

        this.group_session.players[targetIndex].healed = true;

        const protector = {
          index: i,
          roleName: doer.role.name,
          used: false
        };

        this.group_session.players[targetIndex].protectors.push(protector);
      }
    }
  }

  /// Bodyguard Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.blocked) continue;

    if (doer.role.name === "bodyguard" && doer.status === "alive") {
      if (doer.target.index === -1) {
        continue;
      }

      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      if (targetIndex == i) {
        this.group_session.players[i].message += "🦺 Kamu memilih diam di rumah dan menggunakan vest" + "\n\n";

        this.group_session.players[i].role.vest--;
        this.group_session.players[i].vested = true;
      } else {
        const visitor = {
          index: i,
          name: doer.name,
          role: doer.role
        };

        this.group_session.players[targetIndex].visitors.push(visitor);

        checkInfection(i, targetIndex);

        this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";

        this.group_session.players[targetIndex].guarded = true;

        const protector = {
          index: i,
          roleName: doer.role.name,
          used: false
        };

        this.group_session.players[targetIndex].protectors.push(protector);
      }
    }
  }

  /// Survivor Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];
    const roleName = doer.role.name;
    const status = doer.status;
    let isUseSkill = false;
    if (doer.target.index !== -1) {
      isUseSkill = true;
    }

    if (!isUseSkill || doer.blocked) continue;

    if (roleName === "survivor" && status === "alive") {
      this.group_session.players[i].role.vest--;
      this.group_session.players[i].vested = true;
    }
  }

  /// Vampire hunter Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.blocked) continue;

    if (doer.role.name === "vampire-hunter" && doer.status === "alive") {
      if (doer.target.index === -1 || doer.attacked) {
        continue;
      }

      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      if (doer.intercepted) {
        this.group_session.players[i].message += "💡 Kamu tercegat oleh " + target.role.name + "\n\n";
      } else {
        this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";

        const visitor = {
          index: i,
          name: doer.name,
          role: doer.role
        };
        this.group_session.players[targetIndex].visitors.push(visitor);

        checkInfection(i, targetIndex);
      }

      if (target.role.team === "vampire") {
        this.group_session.players[i].message += "🗡️ " + target.name + " adalah seorang Vampire!" + "\n\n";

        this.group_session.players[i].message += "💡 Kamu menyerang " + target.name + "\n\n";

        this.group_session.players[targetIndex].message += "🗡️ Kamu diserang " + doer.role.name + "!" + "\n\n";

        if (doer.intercepted) {
          if (players[targetIndex].bugged) {
            spyBuggedInfo[targetIndex] += "🔍 Target kamu di serang Vampire Hunter yang dia kunjungi!" + "\n\n";
          }
        } else {
          if (players[targetIndex].bugged) {
            spyBuggedInfo[targetIndex] += "🔍 Target kamu di serang Vampire Hunter!" + "\n\n";
          }
        }

        this.group_session.players[targetIndex].attacked = true;

        const attacker = {
          index: i,
          name: doer.name,
          role: doer.role,
          deathNote: doer.deathNote,
          countered: false
        };

        this.group_session.players[targetIndex].attackers.push(attacker);
      } else {
        this.group_session.players[i].message += "💡 " + target.name + " bukan seorang Vampire" + "\n\n";
      }
    }
  }

  /// Vigilante Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.blocked) continue;

    if (doer.role.name === "vigilante" && doer.status === "alive") {
      if (doer.willSuicide) {
        continue;
      }

      if (doer.target.index === -1 || doer.attacked) {
        continue;
      }

      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      this.group_session.players[i].role.bullet--;

      this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";

      const visitor = {
        index: i,
        name: doer.name,
        role: doer.role
      };
      this.group_session.players[targetIndex].visitors.push(visitor);

      checkInfection(i, targetIndex);

      const immuneToBasicAttack = ["serial-killer", "arsonist", "godfather", "executioner"];

      if (this.group_session.isFullMoon) {
        immuneToBasicAttack.push("werewolf");
      }

      if (immuneToBasicAttack.includes(target.role.name)) {
        this.group_session.players[i].message += "💡 Pertahanan targetmu terlalu tinggi untuk dibunuh!" + "\n\n";
        this.group_session.players[targetIndex].message +=
          "💡 Ada yang menyerang kamu tapi pertahanan mu lebih tinggi dari serangan!" + "\n\n";

        if (players[targetIndex].bugged) {
          spyBuggedInfo[targetIndex] += "🔍 Target kamu di serang tapi serangan tersebut tidak mempan!" + "\n\n";
        }
      } else {
        if (target.role.name === "juggernaut") {
          if (target.role.skillLevel >= 2) {
            this.group_session.players[i].message += "💡 Pertahanan targetmu terlalu tinggi untuk dibunuh!" + "\n\n";

            this.group_session.players[targetIndex].message +=
              "💡 Ada yang menyerang kamu tapi pertahanan mu lebih tinggi dari serangan!" + "\n\n";

            if (players[targetIndex].bugged) {
              spyBuggedInfo[targetIndex] += "🔍 Target kamu diserang tapi serangan tersebut tidak mempan!" + "\n\n";
            }

            continue;
          }
        }

        this.group_session.players[i].message += "💡 Kamu menyerang " + target.name + "\n\n";

        this.group_session.players[targetIndex].message += "🔫 Kamu diserang " + doer.role.name + "!" + "\n\n";

        if (players[targetIndex].bugged) {
          spyBuggedInfo[targetIndex] += "🔍 Target kamu di serang Vigilante!" + "\n\n";
        }

        this.group_session.players[targetIndex].attacked = true;

        const attacker = {
          index: i,
          name: doer.name,
          role: doer.role,
          deathNote: doer.deathNote,
          countered: false
        };

        this.group_session.players[targetIndex].attackers.push(attacker);
      }
    }
  }

  /// Serial Killer Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.role.name === "serial-killer" && doer.status === "alive") {
      if (doer.target.index === -1 || doer.attacked) {
        continue;
      }

      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      if (doer.intercepted) {
        this.group_session.players[i].message += "💡 Kamu tercegat oleh " + target.name + "\n\n";
      } else {
        this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";

        const visitor = {
          index: i,
          name: doer.name,
          role: doer.role
        };
        this.group_session.players[targetIndex].visitors.push(visitor);

        checkInfection(i, targetIndex);
      }

      const immuneToBasicAttack = ["serial-killer", "arsonist", "godfather", "executioner"];

      if (this.group_session.isFullMoon) {
        immuneToBasicAttack.push("werewolf");
      }

      if (immuneToBasicAttack.includes(target.role.name)) {
        this.group_session.players[i].message += "💡 Pertahanan targetmu terlalu tinggi untuk dibunuh!" + "\n\n";
        this.group_session.players[targetIndex].message +=
          "💡 Ada yang menyerang kamu tapi pertahanan mu lebih tinggi dari serangan!" + "\n\n";

        if (players[targetIndex].bugged) {
          spyBuggedInfo[targetIndex] += "🔍 Target kamu di serang tapi serangan tersebut tidak mempan!" + "\n\n";
        }
      } else {
        if (target.role.name === "juggernaut") {
          if (target.role.skillLevel >= 2) {
            this.group_session.players[i].message += "💡 Pertahanan targetmu terlalu tinggi untuk dibunuh!" + "\n\n";

            this.group_session.players[targetIndex].message +=
              "💡 Ada yang menyerang kamu tapi pertahanan mu lebih tinggi dari serangan!" + "\n\n";

            if (players[targetIndex].bugged) {
              spyBuggedInfo[targetIndex] += "🔍 Target kamu diserang tapi serangan tersebut tidak mempan!" + "\n\n";
            }

            continue;
          }
        }

        this.group_session.players[i].message += "💡 Kamu menyerang " + target.name + "\n\n";

        if (doer.intercepted) {
          this.group_session.players[targetIndex].message +=
            "🔪 Kamu diserang " + doer.role.name + " yang kamu kunjungi!" + "\n\n";

          if (players[targetIndex].bugged) {
            spyBuggedInfo[targetIndex] += "🔍 Target kamu di serang Serial Killer yang dia kunjungi!" + "\n\n";
          }

          if (players[i].bugged) {
            spyBuggedInfo[targetIndex] +=
              "🔍 Ada yang berusaha role block Targetmu, tetapi Targetmu menyerang balik!" + "\n\n";
          }
        } else {
          this.group_session.players[targetIndex].message += "🔪 Kamu diserang " + doer.role.name + "!" + "\n\n";

          if (players[targetIndex].bugged) {
            spyBuggedInfo[targetIndex] += "🔍 Target kamu di serang Serial Killer!" + "\n\n";
          }
        }

        this.group_session.players[targetIndex].attacked = true;

        const attacker = {
          index: i,
          name: doer.name,
          role: doer.role,
          deathNote: doer.deathNote,
          countered: false
        };

        this.group_session.players[targetIndex].attackers.push(attacker);
      }
    }
  }

  /// Arsonist Ignite Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];
    const roleName = doer.role.name;
    const targetIndex = doer.target.index;

    if (doer.blocked) continue;

    if (roleName === "arsonist" && doer.status === "alive") {
      if (doer.target.index === -1 || doer.attacked) {
        continue;
      }

      if (targetIndex != i) continue;

      let targetIndexes = players.map((p, idx) => {
        if (p.doused && p.status === "alive") {
          return idx;
        }
      });

      for (let u = 0; u < targetIndexes.length; u++) {
        const targetIndex = targetIndexes[u];

        if (targetIndex === undefined) {
          continue;
        }

        const target = players[targetIndex];

        this.group_session.players[i].message += "💡 Kamu bakar rumah " + target.name + "\n\n";

        this.group_session.players[targetIndex].message += "🔥 Rumah kamu dibakar " + doer.role.name + "!" + "\n\n";

        if (players[targetIndex].bugged) {
          spyBuggedInfo[targetIndex] += "🔍 Target kamu di bakar Arsonist!" + "\n\n";
        }

        this.group_session.players[targetIndex].burned = true;

        this.group_session.players[targetIndex].attacked = true;

        const attacker = {
          index: i,
          name: doer.name,
          role: doer.role,
          deathNote: doer.deathNote,
          countered: false
        };

        this.group_session.players[targetIndex].attackers.push(attacker);
      }
    }
  }

  /// Mafia Killing Action
  if (isMainMafiaUseSkill || isBackupMafiaUseSkill) {
    let wasMafiaDoer = players[mafiaDoerIndex];
    if (wasMafiaDoer.attacked) {
      let pastTargetIndex = wasMafiaDoer.target.index;
      let pastTarget = players[pastTargetIndex];

      if (pastTarget && pastTarget.role.name !== "veteran") {
        if (isBackupMafiaUseSkill && mafiaDoerBackupIndex !== -1) {
          mafiaDoerIndex = mafiaDoerBackupIndex;
          this.group_session.players[mafiaDoerIndex].target.index = pastTargetIndex;
        }
      }
    }

    for (let i = 0; i < players.length; i++) {
      if (mafiaDoerIndex === i) {
        const doer = players[i];
        const targetIndex = doer.target.index;

        if (doer.status === "alive" && targetIndex !== -1) {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." + "\n\n";

            break;
          } else if (!doer.attacked) {
            const target = players[targetIndex];

            const visitor = {
              index: i,
              name: doer.name,
              role: doer.role
            };
            this.group_session.players[targetIndex].visitors.push(visitor);

            checkInfection(i, targetIndex);

            if (doer.role.name === "godfather") {
              this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";
            } else {
              this.group_session.players[i].message += "👣 Kamu disuruh ke rumah " + target.name + "\n\n";
            }

            mafiaAnnouncement += `👣 ${doer.name} mengunjungi rumah ${target.name}\n\n`;

            const immuneToBasicAttack = ["serial-killer", "arsonist", "executioner"];

            if (this.group_session.isFullMoon) {
              immuneToBasicAttack.push("werewolf");
            }

            if (target.role.name !== "veteran" || target.target.index === -1) {
              spyMafiaVisitInfo += `🤵 ${target.name} dikunjungi anggota Mafia\n\n`;
            }

            if (immuneToBasicAttack.includes(target.role.name)) {
              this.group_session.players[i].message += "💡 Pertahanan targetmu terlalu tinggi untuk dibunuh!" + "\n\n";
              this.group_session.players[targetIndex].message +=
                "💡 Ada yang menyerang kamu tapi pertahanan mu lebih tinggi dari serangan!" + "\n\n";

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] += "🔍 Target kamu di serang tapi serangan tersebut tidak mempan!" + "\n\n";
              }
            } else {
              if (target.role.name === "juggernaut") {
                if (target.role.skillLevel >= 2) {
                  this.group_session.players[i].message +=
                    "💡 Pertahanan targetmu terlalu tinggi untuk dibunuh!" + "\n\n";

                  this.group_session.players[targetIndex].message +=
                    "💡 Ada yang menyerang kamu tapi pertahanan mu lebih tinggi dari serangan!" + "\n\n";

                  if (players[targetIndex].bugged) {
                    spyBuggedInfo[targetIndex] +=
                      "🔍 Target kamu diserang tapi serangan tersebut tidak mempan!" + "\n\n";
                  }

                  continue;
                }
              }

              this.group_session.players[i].message += "💡 Kamu menyerang " + target.name + "\n\n";

              this.group_session.players[targetIndex].message += "🤵 Kamu diserang " + doer.role.team + "!" + "\n\n";

              this.group_session.players[targetIndex].attacked = true;

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] += "🔍 Target kamu di serang Mafia!" + "\n\n";
              }

              const attacker = {
                index: i,
                name: doer.name,
                role: doer.role,
                deathNote: doer.deathNote,
                countered: false
              };

              this.group_session.players[targetIndex].attackers.push(attacker);
            }

            break;
          }
        }
      }
    }
  }

  /// DEATH ACTION
  for (let i = 0; i < players.length; i++) {
    if (players[i].status === "alive") {
      const isAttacked = players[i].attacked;
      const isVampireBited = players[i].vampireBited;

      const isHealed = players[i].healed;
      const isVested = players[i].vested;
      const isGuarded = players[i].guarded;
      const isSelfHeal = players[i].selfHeal;
      const isProtected = players[i].protected;

      const isBurned = players[i].burned;
      const isHaunted = players[i].isHaunted;
      const willSuicide = players[i].willSuicide;
      const afkCounter = players[i].afkCounter;

      const attackers = players[i].attackers;
      const protectors = players[i].protectors;

      let vestUsed = false;
      let selfHealUsed = false;

      if (isAttacked || isVampireBited) {
        this.group_session.players[i].damage = attackers.length;

        for (let x = 0; x < attackers.length; x++) {
          const attacker = attackers[x];

          if (isHealed || isGuarded) {
            for (let u = 0; u < protectors.length; u++) {
              const protector = protectors[u];

              this.group_session.players[protector.index].message +=
                "💡 " + players[i].name + " diserang semalam!" + "\n\n";

              if (isBurned || isHaunted) {
                this.group_session.players[protector.index].message += "💡 Namun kamu gagal melindunginya" + "\n\n";

                continue;
              }

              if (attacker.countered) continue;

              if (protector.used) continue;

              if (protector.roleName === "bodyguard") {
                // bodyguard tidak lindungi yang diserang veteran alert
                if (attacker.role.name === "veteran") {
                  continue;
                }

                // bodyguard tidak lindungi yang kena pestilence
                if (attacker.role.name === "plaguebearer") {
                  continue;
                }

                // hax rampage nya werewolf / juggernaut
                const rampagingRole = ["werewolf", "juggernaut"];
                if (rampagingRole.includes(attacker.role.name)) {
                  const attackerTargetIndex = players[attacker.index].target.index;
                  if (attackerTargetIndex != i) continue;
                }

                // counter attack
                if (players[protector.index].bugged) {
                  spyBuggedInfo[protector.index] += "🔍 Target kamu sedang melindungi seseorang!" + "\n\n";
                }

                this.group_session.players[i].message += "🛡️ Ada yang menyerang balik penyerang mu!" + "\n\n";

                this.group_session.players[protector.index].role.counterAttackIndex = attacker.index;

                protector.used = true;

                attacker.countered = true;
              }

              if (protector.roleName === "doctor") {
                if (willSuicide || afkCounter >= 3) {
                  this.group_session.players[protector.index].message += "💡 Namun kamu gagal melindunginya" + "\n\n";

                  continue;
                }

                if (players[protector.index].bugged) {
                  spyBuggedInfo[protector.index] += "🔍 Target dari Targetmu di serang!" + "\n\n";
                }

                this.group_session.players[i].message += "💉 Ada yang datang berusaha menyelamatkanmu!" + "\n\n";

                protector.used = true;
              }

              if (afkCounter < 3) this.group_session.players[i].damage--;
            }
          }

          if (isBurned || isHaunted) continue;

          if (isVested && !vestUsed) {
            this.group_session.players[i].damage--;
            vestUsed = true;
          }

          if (isSelfHeal && !selfHealUsed) {
            this.group_session.players[i].damage--;
            selfHealUsed = true;
          }
        }

        if (this.group_session.players[i].damage <= 0) {
          //saved
          if (isVampireBited) {
            this.group_session.players[i].vampireBited = false;
          }

          if (isVested) {
            if (players[i].bugged) {
              spyBuggedInfo[i] += "🔍 Target kamu selamat dari serangan berkat Vest yang digunakannya!" + "\n\n";
            }

            this.group_session.players[i].message += "🦺 Vest yang kamu pakai menyelamatkan nyawamu!" + "\n\n";

            for (let x = 0; x < attackers.length; x++) {
              const attackerIndex = attackers[x].index;
              this.group_session.players[attackerIndex].message +=
                "💡 Pertahanan targetmu terlalu tinggi untuk dibunuh!" + "\n\n";
            }
          }

          if (isSelfHeal) {
            if (players[i].bugged) {
              spyBuggedInfo[i] += "🔍 Target kamu selamat karena menyembuhkan diri sendiri!" + "\n\n";
            }

            this.group_session.players[i].message += "💉 Kamu selamat dengan menyembuhkan diri sendiri!" + "\n\n";

            for (let x = 0; x < attackers.length; x++) {
              const attackerIndex = attackers[x].index;
              this.group_session.players[attackerIndex].message +=
                "💡 Pertahanan targetmu terlalu tinggi untuk dibunuh!" + "\n\n";
            }
          }

          if (isGuarded) {
            if (players[i].bugged) {
              spyBuggedInfo[i] += "🔍 Target kamu selamat karena dilindungi seseorang!" + "\n\n";
            }

            for (let x = 0; x < attackers.length; x++) {
              const attackerIndex = attackers[x].index;
              this.group_session.players[attackerIndex].message +=
                "💡 Pertahanan targetmu terlalu tinggi untuk dibunuh!" + "\n\n";
            }
          }

          if (isHealed) {
            if (players[i].bugged) {
              spyBuggedInfo[i] += "🔍 Target kamu selamat karena disembuhkan!" + "\n\n";
            }

            for (let x = 0; x < attackers.length; x++) {
              const attackerIndex = attackers[x].index;
              this.group_session.players[attackerIndex].message +=
                "💡 Pertahanan targetmu terlalu tinggi untuk dibunuh!" + "\n\n";
            }
          }

          continue;
        } else {
          //not enough protector or no protector

          // check vampireBited
          if (!isAttacked) continue;
        }

        if (isProtected) {
          for (let u = 0; u < protectors.length; u++) {
            let protector = protectors[u];

            if (!protector.roleName === "guardian-angel") {
              continue;
            }

            if (protector.used) continue;

            this.group_session.players[protector.index].message +=
              "💡 " + players[i].name + " diserang semalam!" + "\n\n";

            if (isHaunted || willSuicide || afkCounter >= 3) {
              this.group_session.players[protector.index].message +=
                "💡 " + players[i].name + " gagal dilindungi!" + "\n\n";

              this.group_session.players[i].message += "⚔️ Guardian Angel berusaha melindungi mu namun gagal!" + "\n\n";

              continue;
            }

            this.group_session.players[protector.index].message +=
              "💡 " + players[i].name + " berhasil dilindungi!" + "\n\n";

            if (players[i].bugged) {
              spyBuggedInfo[i] += "🔍 Target kamu selamat karena dilindungi Guardian Angel!" + "\n\n";
            }

            this.group_session.players[i].message += "⚔️ Kamu selamat karena dilindungi Guardian Angel!" + "\n\n";

            protector.used = true;
          }

          if (!isHaunted && !willSuicide && afkCounter < 3) {
            continue;
          }
        }

        this.group_session.players[i].status = "will_death";

        // Pestilence is invicible!
        if (players[i].role.name === "plaguebearer") {
          if (players[i].role.isPestilence) {
            this.group_session.players[i].status = "alive";

            this.group_session.players[i].message += "💡 Walaupun diserang, kamu tidak akan mati!" + "\n\n";
          }
        }
      } else if (willSuicide || afkCounter >= 3) {
        this.group_session.players[i].status = "will_death";
      }
    }
  }

  /// Bodyguard Counter Attack Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.role.name === "bodyguard") {
      const attackerIndex = players[i].role.counterAttackIndex;
      const targetIndex = doer.target.index;

      if (attackerIndex !== -1) {
        const isAttackerHealed = players[attackerIndex].healed;
        const isHealed = players[i].healed;
        const isAttackerProtected = players[attackerIndex].protected;
        const isProtected = players[i].protected;

        this.group_session.players[i].message +=
          "💡 Kamu melawan penyerang " + players[targetIndex].name + ", dan diserang penyerang tersebut!" + "\n\n";

        this.group_session.players[attackerIndex].message +=
          "🛡️ " + players[targetIndex].name + " dilindungi Bodyguard! " + "Kamu diserang Bodyguard!" + "\n\n";

        if (players[i].bugged) {
          spyBuggedInfo[i] += "🔍 Target kamu diserang karena melindungi seseorang!" + "\n\n";
        }

        if (players[attackerIndex].bugged) {
          spyBuggedInfo[attackerIndex] += "🔍 Target kamu diserang Bodyguard!" + "\n\n";
        }

        // attacker checker
        this.group_session.players[attackerIndex].damage += 1;
        if (isAttackerHealed) {
          const attackerProtectors = players[attackerIndex].protectors;
          for (let u = 0; u < attackerProtectors.length; u++) {
            const protector = attackerProtectors[u];

            if (protector.used) {
              continue;
            }

            this.group_session.players[protector.index].message +=
              "💡 " + players[attackerIndex].name + " diserang semalam!" + "\n\n";

            if (protector.roleName === "doctor") {
              if (players[protector.index].bugged) {
                spyBuggedInfo[protector.index] += "🔍 Target dari Targetmu di serang!" + "\n\n";
              }

              this.group_session.players[attackerIndex].message +=
                "💉 Ada yang datang berusaha menyelamatkanmu!" + "\n\n";

              protector.used = true;
            }

            this.group_session.players[attackerIndex].damage--;
          }
        }

        if (isAttackerProtected) {
          const attackerProtectors = players[attackerIndex].protectors;
          for (let u = 0; u < attackerProtectors.length; u++) {
            let protector = attackerProtectors[u];
            if (!protector.roleName === "guardian-angel") {
              continue;
            }

            this.group_session.players[protector.index].message +=
              "💡 " + players[attackerIndex].name + " diserang semalam!" + "\n\n";

            this.group_session.players[attackerIndex].doused = false;
            this.group_session.players[attackerIndex].framed = false;
            this.group_session.players[attackerIndex].infected = false;

            this.group_session.players[protector.index].message +=
              "💡 " + players[attackerIndex].name + " berhasil dilindungi!" + "\n\n";

            if (players[attackerIndex].bugged) {
              spyBuggedInfo[attackerIndex] += "🔍 Target kamu selamat karena dilindungi Guardian Angel!" + "\n\n";
            }

            this.group_session.players[attackerIndex].message +=
              "⚔️ Kamu selamat karena dilindungi Guardian Angel!" + "\n\n";

            allAnnouncement +=
              "⚔️ Guardian Angel berhasil melindungi " + players[attackerIndex].name + " semalam!" + "\n\n";

            // langsung sehat
            this.group_session.players[attackerIndex].damage = 0;
          }
        }

        if (this.group_session.players[attackerIndex].damage <= 0) {
          //saved
          if (isAttackerHealed) {
            if (players[attackerIndex].bugged) {
              spyBuggedInfo[attackerIndex] += "🔍 Target kamu selamat karena disembuhkan!" + "\n\n";
            }
          }

          this.group_session.players[i].message += "💡 Pertahanan targetmu terlalu tinggi untuk dibunuh!" + "\n\n";
        } else {
          //not enough protector or no protector
          this.group_session.players[attackerIndex].status = "will_death";

          const attacker = {
            index: i,
            name: doer.name,
            role: doer.role,
            deathNote: doer.deathNote,
            countered: false
          };

          this.group_session.players[attackerIndex].attackers.push(attacker);
        }

        // bodyguard checker
        // hax jika kenak effect rampage werewolf
        // soalnya pas rampage udah ada damage
        let rampageRole = ["werewolf"];

        if (!rampageRole.includes(players[attackerIndex].role.name)) {
          // check juggernaut juga
          let targetRoleName = players[attackerIndex].role.name;
          if (targetRoleName === "juggernaut") {
            if (players[attackerIndex].role.skillLevel < 3) {
              this.group_session.players[i].damage += 1;
            }
          } else {
            this.group_session.players[i].damage += 1;
          }
        }

        if (isHealed) {
          let protectors = players[i].protectors;
          for (let u = 0; u < protectors.length; u++) {
            let protector = protectors[u];

            if (protector.used) {
              continue;
            }

            this.group_session.players[protector.index].message +=
              "💡 " + players[i].name + " diserang semalam!" + "\n\n";

            if (protector.roleName === "doctor") {
              if (players[protector.index].bugged) {
                spyBuggedInfo[protector.index] += "🔍 Target dari Targetmu di serang!" + "\n\n";
              }

              this.group_session.players[i].message += "💉 Ada yang datang berusaha menyelamatkanmu!" + "\n\n";

              protector.used = true;
            }

            this.group_session.players[i].damage--;
          }
        }

        if (isProtected) {
          let protectors = players[attackerIndex].protectors;
          for (let u = 0; u < protectors.length; u++) {
            let protector = protectors[u];
            if (!protector.roleName === "guardian-angel") {
              continue;
            }

            this.group_session.players[protector.index].message +=
              "💡 " + players[i].name + " diserang semalam!" + "\n\n";

            this.group_session.players[i].doused = false;
            this.group_session.players[i].framed = false;
            this.group_session.players[i].infected = false;

            this.group_session.players[protector.index].message +=
              "💡 " + players[i].name + " berhasil dilindungi!" + "\n\n";

            if (players[i].bugged) {
              spyBuggedInfo[i] += "🔍 Target kamu selamat karena dilindungi Guardian Angel!" + "\n\n";
            }

            this.group_session.players[i].message += "⚔️ Kamu selamat karena dilindungi Guardian Angel!" + "\n\n";

            allAnnouncement += "⚔️ Guardian Angel berhasil melindungi " + players[i].name + " semalam!" + "\n\n";

            // langsung sehat
            this.group_session.players[i].damage = 0;
          }
        }

        if (this.group_session.players[i].damage <= 0) {
          //saved
          if (isHealed) {
            if (players[i].bugged) {
              spyBuggedInfo[i] += "🔍 Target kamu selamat karena disembuhkan!" + "\n\n";
            }
          }

          this.group_session.players[attackerIndex].message +=
            "💡 Pertahanan targetmu terlalu tinggi untuk dibunuh!" + "\n\n";
        } else {
          //not enough protector or no protector

          this.group_session.players[i].status = "will_death";

          const attacker = {
            index: attackerIndex,
            name: players[attackerIndex].name,
            role: players[attackerIndex].role,
            deathNote: players[attackerIndex].deathNote,
            countered: false
          };

          // hax jika kenak effect rampage werewolf atau juggernaut
          // soalnya pas rampage udah ada dimasukin obj attacker
          const rampageRole = ["werewolf"];

          if (!rampageRole.includes(players[attackerIndex].role.name)) {
            // check juggernaut juga
            const targetRoleName = players[attackerIndex].role.name;
            if (targetRoleName === "juggernaut") {
              if (players[attackerIndex].role.skillLevel < 3) {
                this.group_session.players[i].attackers.push(attacker);
              }
            } else {
              this.group_session.players[i].attackers.push(attacker);
            }
          }
        }

        //reset bg counter attack
        this.group_session.players[i].role.counterAttackIndex = -1;
      }
    }
  }

  /// Psychic Action
  for (let i = 0; i < players.length; i++) {
    let doer = players[i];

    if (doer.blocked) continue;

    if (doer.role.name === "psychic" && doer.status === "alive") {
      const isFullMoon = this.group_session.isFullMoon;
      const psychicResult = util.getPsychicResult(players, i, isFullMoon);

      this.group_session.players[i].message += "🔮 " + psychicResult + "\n\n";

      this.group_session.players[i].skillResult = psychicResult;
    }
  }

  /// Death Action II
  const nonVisitDead = ["veteran", "jester", "arsonist"];
  for (let i = 0; i < players.length; i++) {
    if (players[i].status === "will_death") {
      let attackedAnnouncement = "";
      let willSuicide = players[i].willSuicide;
      let roleName = players[i].role.name;
      if (players[i].role.disguiseAs) {
        roleName = players[i].role.disguiseAs;
      }

      // Check untuk juggernaut, buat level up skillLevel sesuai index masing"
      let attackersIndex = [];

      this.group_session.players[i].status = "death";

      let attackersRole = [];

      if (players[i].attackers.length > 0) {
        attackersRole = players[i].attackers
          .filter(atkr => {
            if (atkr.countered) {
              return false;
            }
            return true;
          })
          .map(atkr => {
            return atkr.role.name;
          });

        attackersIndex = players[i].attackers.map(atkr => {
          return atkr.index;
        });
      }

      for (let j = 0; j < attackersIndex.length; j++) {
        const attackerIndex = attackersIndex[j];
        if (players[attackerIndex].role.name === "juggernaut") {
          this.group_session.players[attackerIndex].role.skillLevel++;

          let text = "";
          const skillLevel = this.group_session.players[attackerIndex].role.skillLevel;
          switch (skillLevel) {
            case 1:
              text += "💪 Kamu sekarang bisa menyerang pada malam apa saja";
              break;

            case 2:
              text += "💪 Kamu sekarang bisa kebal dari serangan biasa";
              break;

            case 3:
              text += "💪 Kamu sekarang bisa RAMPAGE pada rumah target";
              break;

            case 4:
              text += "💪 Seranganmu sekarang bisa menembus perlindungan biasa";
              break;
          }

          this.group_session.players[attackerIndex].addonMessage = text;
        }

        if (!nonVisitDead.includes(players[attackerIndex].role.name)) {
          this.group_session.justDeadIndexes.push(i);
        }
      }

      let isAfk = false;
      let isSuicide = false;

      if (attackersRole.length > 0) {
        //
      } else if (players[i].afkCounter >= 3) {
        isAfk = true;
      } else if (willSuicide) {
        isSuicide = true;
        if (players[i].bugged) {
          spyBuggedInfo[i] += "🔍 Target kamu mati bunuh diri karena perasaan bersalah!" + "\n\n";
        }
      }

      attackedAnnouncement = attackedMsg.getAttackResponse(attackersRole, players[i].name, isSuicide, isAfk);

      allAnnouncement += attackedAnnouncement + "\n";

      let emoji = util.getRoleNameEmoji(roleName);
      allAnnouncement += `✉️ Role nya adalah ${roleName} ${emoji}\n\n`;

      if (this.group_session.nightCounter === 1) {
        const lastFirstBloodIds = this.group_session.lastFirstBloodIds;
        for (let x = 0; x < lastFirstBloodIds.length; x++) {
          const lastId = lastFirstBloodIds[x];
          if (players[i].id === lastId) {
            allAnnouncement += `☠️ ${players[i].name} kenak first blood lagi sejak game terakhir\n\n`;
          }
        }

        this.group_session.currentFirstBloodIds.push(players[i].id);
      }

      //Thanks to
      //https://stackoverflow.com/questions/24806772/how-to-skip-over-an-element-in-map/24806827
      const attackersDeathNote = players[i].attackers
        .filter(atkr => {
          if (!atkr.deathNote) {
            return false;
          }
          return true;
        })
        .map(atkr => {
          let note = atkr.deathNote + "\n\n";

          if (atkr.role.type === "Mafia Killing") {
            note += "- mafia";
          } else {
            note += "- " + atkr.role.name;
          }

          return note;
        })
        .join("\n\n");

      let victimName = players[i].name;
      if (attackersDeathNote) {
        let deathFlex_text = {
          headerText: "📝💀 Death Note " + victimName,
          bodyText: attackersDeathNote
        };

        flex_texts.push(deathFlex_text);
      }

      ///yang baru mati
      if (this.group_session.players[i].status === "death") {
        /// special check for some role

        // executioner
        for (let j = 0; j < players.length; j++) {
          const roleName = players[j].role.name;

          if (roleName === "executioner" && players[j].status === "alive") {
            if (players[j].role.targetLynchIndex === i) {
              this.group_session.players[j].role.isTargetLynched = true;

              this.group_session.players[j].message +=
                "💡 Targetmu mati pas malam dibunuh. Kamu menjadi Jester" + "\n\n";

              const roleData = getRoleData("jester");
              this.group_session.players[j].role = roleData;
            }
          }
        }

        // guardian angel
        for (let j = 0; j < players.length; j++) {
          const roleName = players[j].role.name;
          const status = players[j].status;

          if (roleName === "guardian-angel" && status === "alive") {
            if (players[j].role.mustProtectIndex === i) {
              const roleData = getRoleData("survivor");
              this.group_session.players[j].role = roleData;
              this.group_session.players[j].role.vest = 0;

              this.group_session.players[j].message +=
                "💡 Targetmu mati, sekarang kamu hanyalah Survivor tanpa vest" + "\n\n";
            }
          }
        }

        // mafia
        substituteMafia(this.group_session.players[i]);
      }
    }
  }

  /// Arsonist Visitor fetch

  // gather
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];
    if (doer.status === "alive" && doer.target.index !== -1) {
      if (doer.target.index != i) {
        const targetIndex = doer.target.index;
        const target = players[targetIndex];

        if (doer.role.name === "jester") continue;

        if (doer.blocked) continue;

        if (doer.role.name === "plaguebearer") {
          if (doer.role.isPestilence) continue;
        }

        // hax untuk Mafia yang tukang bunuh bukan godfather, tapi mafioso
        // juga vampire yang pergi cman 1 aja
        if (target.role.name === "arsonist") {
          if (doer.role.name === "godfather") {
            if (mafiaDoerIndex !== i) continue;
          }

          if (doer.role.name === "vampire") {
            if (vampireDoerIndex !== i) continue;
          }

          if (!doer.doused) {
            this.group_session.players[i].doused = true;
            arsonistAnnouncement[targetIndex] += `⛽ ${doer.name} mengunjungimu semalam dan tersiram bensin!\n\n`;
          }
        }
      }
    }
  }

  // inform
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];
    if (doer.role.name === "arsonist" && doer.status === "alive") {
      if (arsonistAnnouncement[i]) {
        this.group_session.players[i].message += arsonistAnnouncement[i];
      }
    }
  }

  /// Vampire convertion Action
  for (let i = 0; i < players.length; i++) {
    if (players[i].status === "alive" && players[i].willSuicide === false) {
      if (players[i].vampireBited === true && players[i].healed === false) {
        let roleData = getRoleData("vampire");

        this.group_session.players[i].role = roleData;

        this.group_session.players[i].message += "🧛 " + "Kamu berhasil diubah menjadi Vampire" + "\n\n";

        this.group_session.players[i].message += "💡 Ketik '/role' untuk mengetahui siapa saja sesama Vampire" + "\n\n";

        vampireAnnouncement += `🧛 ${players[i].name} berhasil menjadi Vampire!\n\n`;

        this.group_session.vampireConvertCooldown = 1;

        break;
      }
    }
  }

  // Check vampire hunter can convert to vigi or not
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.role.name === "vampire-hunter" && doer.status === "alive") {
      let isVampireExists = checkExistsRole("vampire");

      if (isVampireExists) break;

      const roleData = getRoleData("vigilante");

      this.group_session.players[i].role = roleData;
      this.group_session.players[i].role.bullet = 1;
      this.group_session.players[i].role.isLoadBullet = false;

      this.group_session.players[i].message +=
        "🔫 Indra perasamu menunjukkan tidak ada Vampire lagi di kota ini, dan kamu memutuskan untuk menjadi Vigilante" +
        "\n\n";
    }
  }

  /// Framer Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.blocked) continue;

    if (doer.role.name === "framer" && doer.status === "alive") {
      if (doer.target.index === -1) continue;

      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      const visitor = {
        index: i,
        name: doer.name,
        role: doer.role
      };

      this.group_session.players[targetIndex].visitors.push(visitor);

      checkInfection(i, targetIndex);

      this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";

      this.group_session.players[i].message += "🎞️ Kamu menjebak " + target.name + " agar terlihat bersalah" + "\n\n";

      this.group_session.players[targetIndex].framed = true;

      mafiaAnnouncement += `🎞️ ${doer.name} menjebak ${target.name}\n\n`;

      if (target.role.name !== "veteran" || target.target.index === -1) {
        spyMafiaVisitInfo += `🤵 ${target.name} dikunjungi anggota Mafia\n\n`;
      }
    }
  }

  /// Sheriff Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.blocked) continue;

    if (doer.role.name === "sheriff" && doer.status === "alive") {
      if (doer.target.index === -1) continue;

      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      const visitor = {
        index: i,
        name: doer.name,
        role: doer.role
      };

      this.group_session.players[targetIndex].visitors.push(visitor);

      checkInfection(i, targetIndex);

      this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";

      const suspiciousList = ["mafioso", "consigliere", "consort", "serial-killer", "framer", "disguiser"];

      if (this.group_session.isFullMoon) {
        suspiciousList.push("werewolf");
      }

      if (target.framed) {
        this.group_session.players[targetIndex].investigated = true;
      }

      if (target.framed || suspiciousList.includes(target.role.name)) {
        this.group_session.players[i].message += "👮 " + target.name + " mencurigakan" + "\n\n";

        this.group_session.players[i].skillResult = target.name + " mencurigakan";

        this.group_session.players[i].claimedRole.targetIndex = targetIndex;
      } else {
        this.group_session.players[i].message +=
          "👮 Kamu tidak menemukan bukti kesalahan target. Tampaknya " + target.name + " tidak bersalah" + "\n\n";

        this.group_session.players[i].skillResult =
          "Kamu tidak menemukan bukti kesalahan target. Tampaknya " + target.name + " tidak bersalah";
      }
    }
  }

  /// Investigator Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.blocked) continue;

    if (doer.role.name === "investigator" && doer.status === "alive") {
      if (doer.target.index === -1) continue;

      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      const visitor = {
        index: i,
        name: doer.name,
        role: doer.role
      };

      this.group_session.players[targetIndex].visitors.push(visitor);

      checkInfection(i, targetIndex);

      let targetRoleName = target.role.name;

      if (target.framed) {
        targetRoleName = "framer";
      }

      if (target.role.disguiseAs) {
        targetRoleName = target.role.disguiseAs;
      }

      if (target.doused) {
        targetRoleName = "arsonist";
      }

      if (target.framed) {
        this.group_session.players[targetIndex].investigated = true;
      }

      this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";

      const guessResult = util.getInvestigatorResult(targetRoleName);

      this.group_session.players[i].message += "🕵️ " + guessResult + "\n\n";

      this.group_session.players[i].skillResult = `Cek ${target.name}\n${guessResult}`;

      const { items } = util.getInvestigatorPairList(targetRoleName);
      for (let u = 0; u < items.length; u++) {
        const { team } = rawRoles[items[u]].getData();
        if (evilTeams.includes(team)) {
          this.group_session.players[i].claimedRole.targetIndex = targetIndex;
          break;
        }
      }
    }
  }

  /// Consigliere Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.blocked) continue;

    if (doer.role.name === "consigliere" && doer.status === "alive") {
      if (doer.target.index === -1) continue;

      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      const visitor = {
        index: i,
        name: doer.name,
        role: doer.role
      };

      this.group_session.players[targetIndex].visitors.push(visitor);

      checkInfection(i, targetIndex);

      this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";

      let targetRoleName = target.role.name;
      if (targetRoleName === "plaguebearer" && target.role.isPestilence) {
        targetRoleName = "pestilence";
      }

      mafiaAnnouncement += `✒️ Role ${target.name} adalah ${targetRoleName}\n\n`;

      if (target.role.name !== "veteran" || target.target.index === -1) {
        spyMafiaVisitInfo += `🤵 ${target.name} dikunjungi anggota Mafia\n\n`;
      }
    }
  }

  /// Spy Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.blocked) continue;

    if (doer.role.name === "spy" && doer.status === "alive") {
      if (!doer.blocked) {
        this.group_session.players[i].message += spyMafiaVisitInfo;
        this.group_session.players[i].skillResult = spyMafiaVisitInfo;
      }

      if (doer.target.index === -1) continue;

      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      const visitor = {
        index: i,
        name: doer.name,
        role: doer.role
      };

      this.group_session.players[targetIndex].visitors.push(visitor);

      checkInfection(i, targetIndex);

      this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";

      if (spyBuggedInfo[targetIndex]) {
        this.group_session.players[i].message += spyBuggedInfo[targetIndex];

        this.group_session.players[i].skillResult += `Sadap ${target.name}\n${spyBuggedInfo[targetIndex].trim()}`;
      } else {
        this.group_session.players[i].message += "🔍 " + target.name + " tidak terkena apa apa" + "\n\n";

        this.group_session.players[i].skillResult += "🔍 " + target.name + " tidak terkena apa apa";
      }
    }
  }

  /// Lookout & Tracker visit action
  // for more than 1 lookout and because tracker action is below lookout
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.blocked) continue;

    const roleList = ["lookout", "tracker"];

    if (roleList.includes(doer.role.name) && doer.status === "alive") {
      if (doer.target.index === -1) continue;

      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      const visitor = {
        index: i,
        name: doer.name,
        role: doer.role
      };

      this.group_session.players[targetIndex].visitors.push(visitor);

      checkInfection(i, targetIndex);

      this.group_session.players[i].message += "👣 Kamu ke rumah " + target.name + "\n\n";
    }
  }

  /// Lookout Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.blocked) continue;

    if (doer.role.name === "lookout" && doer.status === "alive") {
      if (doer.target.index === -1) continue;

      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      if (target.visitors.length > 1) {
        let targetVisitors = "";
        let visitors = target.visitors.map(v => {
          return {
            name: v.name,
            index: v.index
          };
        });

        for (let i = 0; i < visitors.length; i++) {
          if (visitors[i].name === doer.name) {
            visitors.splice(i, 1);
          }
        }

        targetVisitors = visitors.map(item => {
          return item.name;
        });

        this.group_session.players[i].message +=
          "👀 Rumah " + players[targetIndex].name + " dikunjungi " + targetVisitors.join(", ") + " semalam" + "\n\n";

        this.group_session.players[i].skillResult =
          "Rumah " + players[targetIndex].name + " dikunjungi " + targetVisitors.join(", ") + " semalam";

        if (this.group_session.justDeadIndexes.includes(targetIndex)) {
          if (visitors.length === 1) {
            this.group_session.players[i].claimedRole.targetIndex = visitors[0].index;
          } else {
            const { index } = util.random(visitors);
            this.group_session.players[i].claimedRole.targetIndex = index;
          }
        }
      } else {
        // pasti ada 1 visitor, yaitu lookout sndiri
        this.group_session.players[i].message +=
          "👀 Rumah " + players[targetIndex].name + " tidak didatangi siapa siapa" + "\n\n";

        this.group_session.players[i].skillResult =
          "Rumah " + players[targetIndex].name + " tidak didatangi siapa siapa";
      }
    }
  }

  /// Tracker action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.blocked) continue;

    if (doer.role.name === "tracker" && doer.status === "alive") {
      if (doer.target.index === -1) continue;

      const targetIndex = doer.target.index;
      const target = players[targetIndex];

      const stayAtHome = "👣 Target mu diam di rumah saja" + "\n\n";

      if (target.intercepted || target.blocked || target.target.index === -1 || target.target.index === targetIndex) {
        this.group_session.players[i].message += stayAtHome;
      } else {
        let stayHome = false;
        if (target.role.name === "godfather") {
          if (mafiaDoerIndex != targetIndex) stayHome = true;
        } else if (target.role.name === "vampire") {
          if (vampireDoerIndex != targetIndex) stayHome = true;
        } else {
          stayHome = false;
        }

        if (stayHome) {
          this.group_session.players[i].message += stayAtHome;

          this.group_session.players[i].skillResult = `${target.name} diam di rumah saja`;
        } else {
          const targetTargetName = players[target.target.index].name;
          this.group_session.players[i].message += `👣 Target mu ke rumah ${targetTargetName}\n\n`;

          this.group_session.players[i].skillResult = `${target.name} ke rumah ${targetTargetName}`;

          if (this.group_session.justDeadIndexes.includes(target.target.index)) {
            this.group_session.players[i].claimedRole.targetIndex = targetIndex;
          }
        }
      }
    }
  }

  /// Amnesiac Action
  for (let i = 0; i < players.length; i++) {
    const doer = players[i];

    if (doer.blocked) continue;

    if (doer.role.name === "amnesiac" && doer.status === "alive") {
      if (doer.target.index === -1) continue;

      const targetIndex = doer.target.index;
      const target = players[targetIndex];
      let targetRoleName = target.role.name;

      if (target.role.isDisguiseAs) {
        targetRoleName = "disguiser";
      }

      if (targetRoleName === "executioner") {
        const neededTargetIndex = getExecutionerTargetIndex(i, true);
        if (neededTargetIndex === -1) {
          targetRoleName = "jester";
        } else {
          this.group_session.players[i].role.targetLynchIndex = neededTargetIndex;
          this.group_session.players[i].role.isTargetLynched = false;
        }
      } else if (targetRoleName === "guardian-angel") {
        const neededTargetIndex = getGuardianAngelTargetIndex(i, true);

        if (neededTargetIndex === -1) {
          targetRoleName = "survivor";
          this.group_session.players[i].role.vest = 0;
        } else {
          this.group_session.players[i].role.mustProtectIndex = neededTargetIndex;
        }
      }

      const roleData = getRoleData(targetRoleName);
      this.group_session.players[i].role = roleData;

      this.group_session.players[i].message +=
        "🤕 Kamu ingat bahwa kamu adalah seorang " + targetRoleName + "!" + "\n\n";

      allAnnouncement += "🤕 Amnesiac mengingat bahwa dia adalah " + targetRoleName + "!" + "\n\n";
    }
  }

  /// Plaguebearer action set infected
  for (let i = 0; i < players.length; i++) {
    const status = players[i].status;

    if (status === "death") continue;

    if (players[i].justInfected) {
      this.group_session.players[i].infected = true;
      this.group_session.players[i].justInfected = false;
      plaguebearerAnnouncement += `☣️ ${players[i].name} telah terinfeksi!\n`;
    }
  }

  /// Plaguebearer action infect data
  for (let i = 0; i < players.length; i++) {
    let doer = players[i];

    if (doer.role.name === "plaguebearer" && doer.status === "alive") {
      if (doer.role.isPestilence) continue;

      this.group_session.players[i].message += plaguebearerAnnouncement + "\n";

      let alivePlayersCount = 0;
      let infectedCount = 0;
      for (let j = 0; j < players.length; j++) {
        if (players[j].status === "alive" && i != j) {
          if (players[j].infected) infectedCount++;
          alivePlayersCount++;
        }
      }

      if (infectedCount === alivePlayersCount) {
        this.group_session.players[i].message +=
          "☣️ Kamu telah menginfeksi seluruh orang! Kamu akan menjadi Pestilence!";

        this.group_session.players[i].role.isPestilence = true;
        this.group_session.players[i].role.canKill = true;

        allAnnouncement += "☣️ Penyakit sampar telah menyerang kota ini!" + "\n\n";
      }
    }
  }

  /// Post Vigilante check the target
  for (let i = 0; i < players.length; i++) {
    let doer = players[i];
    if (doer.role.name === "vigilante" && doer.status === "alive") {
      let vigiTargetIndex = doer.target.index;
      if (vigiTargetIndex !== -1) {
        let vigiTarget = players[vigiTargetIndex];

        if (vigiTarget.role.team !== "villager") {
          continue;
        }

        let vigiTargetAttackersIndex = vigiTarget.attackers.map(atkr => {
          return atkr.index;
        });

        if (vigiTargetAttackersIndex.includes(i)) {
          if (vigiTarget.status === "death") {
            this.group_session.players[i].willSuicide = true;
            this.group_session.players[i].message += "💡 Kamu membunuh warga!" + "\n\n";
          }
        }
      }
    }
  }

  // Restore framed status
  for (let i = 0; i < players.length; i++) {
    if (players[i].status === "alive") {
      if (players[i].framed && players[i].investigated) {
        console.log(`${players[i].name} restored`);
        this.group_session.players[i].framed = false;
      }
    }
  }

  /// untuk announcement certain role
  this.group_session.players.forEach(item => {
    /// Vampire Announcement
    if (item.role.team === "vampire" && item.status === "alive") {
      item.message += vampireAnnouncement;
    }

    /// Mafia Announcement
    if (item.role.team === "mafia" && item.status === "alive") {
      item.message += mafiaAnnouncement;
    }

    if (!item.message && item.status === "alive") {
      item.message += "🛏️ Kamu tidak diganggu semalam";
    }

    if (process.env.TEST === "true") {
      console.log(`pesan ${item.name} (${item.role.name}) : ${item.message}`);
    }

    if (item.message) {
      const flex_text = {
        headerText: "🌙 Berita Malam ke - " + this.group_session.nightCounter,
        bodyText: item.message
      };

      pushFlex(item.id, flex_text);

      /// journal , keep this below any special Announcement

      const journal = {
        nightCounter: this.group_session.nightCounter,
        content: item.message.trim()
      };
      item.journals.push(journal);
    }
  });

  if (!allAnnouncement) {
    let peaceText = util.random(peaceMsg);
    allAnnouncement += peaceText + "\n\n";
  }

  const dayCounter = this.group_session.nightCounter + 1;
  let flex_text = {
    headerText: `${util.getDayEmoji()} Hari - ${dayCounter}`,
    bodyText: allAnnouncement
  };

  ///check victory

  if (this.group_session.mode === "vip") {
    if (players[this.group_session.vipIndex].status === "death") {
      flex_text.bodyText += `⭐ ${players[this.group_session.vipIndex].name} telah mati!`;
      flex_texts.unshift(flex_text);
      return endGame(flex_texts, "mafia");
    }
  }

  let someoneWin = checkVictory();

  if (someoneWin) {
    flex_texts.unshift(flex_text);
    return endGame(flex_texts, someoneWin);
  } else {
    let alivePlayersCount = getAlivePlayersCount();
    this.group_session.time_default = getTimeDefault(alivePlayersCount);
    this.group_session.time = this.group_session.time_default;

    let timerText = "💬 Warga diberi waktu diskusi selama " + this.group_session.time_default + " detik" + "\n";

    timerText += "💀 Siapa yang mau di" + this.group_session.punishment;

    flex_text.bodyText += timerText;

    if (this.group_session.nightCounter === 1) {
      flex_text.bodyText += "\n\n" + "💡 Pengguna Skill jangan lupa gunakan commands '/news' di pc bot";
    }

    flex_text.buttons = [
      {
        action: "uri",
        label: "✉️ Hasil Skill",
        data: "https://line.me/R/oaMessage/" + process.env.BOT_ID + "/?%2Fnews"
      }
    ];

    runTimer();

    flex_texts.unshift(flex_text);
    return replyFlex(flex_texts);
  }
};

const checkInfection = (index, targetIndex) => {
  const target = this.group_session.players[targetIndex];
  const isDoerInfected = this.group_session.players[index].infected;
  const isTargetInfected = this.group_session.players[targetIndex].infected;

  if (target.role.name === "plaguebearer") {
    if (!isDoerInfected) {
      this.group_session.players[index].justInfected = true;
    }
  } else {
    if (isDoerInfected && !isTargetInfected) {
      this.group_session.players[targetIndex].justInfected = true;
    } else if (isTargetInfected && !isDoerInfected) {
      this.group_session.players[index].justInfected = true;
    }
  }
};

const getGuardianAngelTargetIndex = (guardianAngelIndex, isAmnesiac) => {
  const players = this.group_session.players;
  const maxIndex = players.length - 1;

  const prohibited = ["jester", "executioner", "guardian-angel", "bodyguard", "vigilante"];

  if (isAmnesiac) {
    let isTargetAvailable = false;
    for (let i = 0; i < players.length; i++) {
      let roleName = players[i].role.name;
      if (!prohibited.includes(roleName) && players[i].status === "alive") {
        isTargetAvailable = true;
      }
    }

    if (!isTargetAvailable) {
      // langsung jadikan survivor tanpa vest
      let index = -1;
      return index;
    }
  }

  while (true) {
    let targetIndex = util.getRandomInt(0, maxIndex);
    let roleName = players[targetIndex].role.name;
    if (!prohibited.includes(roleName) && players[targetIndex].status === "alive") {
      return targetIndex;
    }
  }
};

const getExecutionerTargetIndex = (exeIndex, isAmnesiac) => {
  const players = this.group_session.players;
  const maxIndex = players.length - 1;

  if (isAmnesiac) {
    let isThereTownie = false;
    for (let i = 0; i < players.length; i++) {
      let team = players[i].role.team;
      if (team === "villager" && players[i].status === "alive") {
        isThereTownie = true;
      }
    }

    if (!isThereTownie) {
      // langsung aja jadikan ke jester
      let index = -1;
      return index;
    }
  }

  while (true) {
    let targetIndex = util.getRandomInt(0, maxIndex);
    let isTownie = false;
    let team = players[targetIndex].role.team;
    if (team === "villager" && players[targetIndex].status === "alive") {
      isTownie = true;
    }
    if (targetIndex !== exeIndex && isTownie) {
      return targetIndex;
    }
  }
};

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

  const index = indexOfPlayer();
  const players = this.group_session.players;

  if (index === -1) {
    let text = "💡 " + this.user_session.name;
    text += ", kamu belum join kedalam game";
    return replyText(text);
  }

  let minPlayers = 5;
  if (players.length < minPlayers) {
    const remainingPlayer = minPlayers - players.length;
    let text = `💡 Game belum bisa dimulai, kurang ${remainingPlayer} pemain lagi. `;
    text += "🤖 Kamu bisa nambahin bot sebagai pemain dengan '/addbot'";
    return replyText(text);
  }

  if (this.group_session.mode === "custom") {
    const customRolesCount = this.group_session.customRoles.length;
    if (customRolesCount > players.length) {
      return replyText(
        "💡 Game tidak dapat dimulai karena jumlah Custom Roles yang telah di atur melebihi jumlah pemain!"
      );
    }
  }

  this.group_session.punishment = util.random(punishment);

  this.group_session.lastFirstBloodIds = [...this.group_session.currentFirstBloodIds];
  this.group_session.currentFirstBloodIds = [];

  randomRoles();
};

const randomRoles = () => {
  const players = this.group_session.players;
  const playersLength = players.length;

  let roles = [];
  let customRoles = this.group_session.customRoles;
  roles = modes[this.group_session.mode].generate(playersLength, customRoles);

  this.group_session.players.forEach((item, index) => {
    if (index <= roles.length - 1) {
      item.role.name = roles[index];
    }

    item.role = getRoleData(item.role.name);
  });

  this.group_session.players = util.shuffleArray(this.group_session.players);

  // get the vip
  if (this.group_session.mode === "vip") {
    const prohibited = ["bodyguard", "vigilante"];
    let vipId = "";
    for (let i = 0; i < this.group_session.players.length; i++) {
      const role = this.group_session.players[i].role;
      if (role.team === "villager" && !prohibited.includes(role.name)) {
        vipId = this.group_session.players[i].id;
        break;
      }
    }

    this.group_session.players = util.shuffleArray(this.group_session.players);

    for (let i = 0; i < this.group_session.players.length; i++) {
      if (this.group_session.players[i].id === vipId) {
        this.group_session.vipIndex = i;
        break;
      }
    }
  }

  this.group_session.players.forEach((item, index) => {
    /// init private prop special role
    switch (item.role.name) {
      case "executioner":
        item.role.targetLynchIndex = getExecutionerTargetIndex(index);
        item.role.isTargetLynched = false;
        break;

      case "guardian-angel":
        item.role.mustProtectIndex = getGuardianAngelTargetIndex(index);
        break;
    }
  });

  /// untuk role yang berubah-berubah

  // vampire hunter to vigi
  checkMorphingRole("vampire-hunter", "vampire", "vigilante");

  // set roles list
  this.group_session.roles = getRoleList();

  // villager code
  this.group_session.villagerCode = "";
  let cnt = 0;
  for (let i = 0; i < this.group_session.players.length; i++) {
    if (this.group_session.players[i].role.name === "villager") {
      cnt++;
    }
  }

  if (cnt > 1) {
    this.group_session.villagerCode = getVillagerCode();
  }

  night();
};

const getRoleList = () => {
  let roles = this.group_session.players.map(player => {
    if (this.group_session.mode === "custom") {
      return player.role.name;
    } else {
      return player.role.type;
    }
  });

  if (this.group_session.mode === "custom") {
    roles = util.shuffleArray(roles);
    return roles;
  }

  // Thanks to https://stackoverflow.com/questions/5667888/counting-the-occurrences-frequency-of-array-elements
  let counts = {};
  for (let i = 0; i < roles.length; i++) {
    let num = roles[i];
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  let list = [];
  let filtered = Object.keys(counts);
  for (let i = 0; i < filtered.length; i++) {
    let role = filtered[i];
    let cnt = counts[role];
    if (cnt > 1) {
      list.push(role + " (" + cnt + ")");
    } else {
      list.push(role);
    }
  }
  util.shuffleArray(list);
  return list;
};

const getJesterTargetIndex = jesterId => {
  const players = this.group_session.players;
  let maxIndex = players.length - 1;

  while (true) {
    let targetIndex = util.getRandomInt(0, maxIndex);
    let targetId = players[targetIndex].id;
    if (targetId !== jesterId && players[targetIndex].status === "alive") {
      return targetIndex;
    }
  }
};

const getVillagerCode = () => {
  const words = [
    "curiga",
    "bohong",
    "setuju",
    "tidur",
    "fitnah",
    "rasain",
    "menang",
    "kalah",
    "percaya",
    "janji",
    "dusta",
    "diam",
    "berisik",
    "tenang",
    "santai",
    "perasaan",
    "ketahuan",
    "terciduk",
    "tolong",
    "tembak"
  ];

  const word = util.random(words);

  return word;
};

const night = () => {
  this.group_session.nightCounter++;

  this.group_session.state = "night";

  if (this.group_session.nightCounter % 2 == 0) {
    this.group_session.isFullMoon = true;
  } else {
    this.group_session.isFullMoon = false;
  }

  this.group_session.justDeadIndexes = [];

  /// special role chat
  this.group_session.mafiaChat = [];
  this.group_session.vampireChat = [];
  this.group_session.vampireHunterChat = [];

  // set prop yang reset tiap malamnya (TEMPORARY prop)
  this.group_session.players.forEach(item => {
    // all player regardless alive or not
    item.message = "";
    item.blocked = false;
    item.target = { index: -1, value: 1 };
    item.skillResult = "";

    // only alive player
    if (item.status === "alive") {
      item.attacked = false;
      item.healed = false;
      item.targetVoteIndex = -1;
      item.vampireBited = false;
      item.visitors = [];
      item.attackers = [];
      item.protectors = [];
      item.intercepted = false;
      item.vested = false;
      item.guarded = false;
      item.bugged = false;
      item.selfHeal = false;
      item.damage = 0;
      item.protected = false;
      item.investigated = false;

      //special role (vampire)
      if (item.role.team === "vampire") {
        item.role.age++;
      }

      if (item.role.name === "vigilante") {
        if (this.group_session.nightCounter > 1 && item.role.isLoadBullet) {
          item.role.isLoadBullet = false;
        }
      }
    }
  });

  /// untuk role yang berubah-berubah

  // vampire hunter to vigi
  checkMorphingRole("vampire-hunter", "vampire", "vigilante");

  const alivePlayersCount = getAlivePlayersCount();
  this.group_session.time_default = getTimeDefault(alivePlayersCount);
  this.group_session.time = this.group_session.time_default;

  let announcement = "";

  if (this.group_session.isShowRole) {
    announcement += "📣 Role yang ada di game ini bisa cek di '/roles'. " + "\n\n";
  }

  if (this.group_session.nightCounter === 1) {
    announcement += "💡 Jangan lupa ketik '/role' di pc bot untuk menggunakan skill" + "\n\n";

    const { naration } = modes[this.group_session.mode].getData();
    announcement += naration + "\n\n";
  } else {
    announcement += "🏘️ 🛏️ Setiap warga kembali kerumah masing-masing" + "\n\n";
  }

  if (this.group_session.isFullMoon) {
    announcement += "🌕 Bulan terlihat indah malam ini, bulan purnama!" + "\n\n";
  }

  // check pestilence
  if (checkExistsRole("plaguebearer")) {
    const players = this.group_session.players;
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "plaguebearer" && doer.status === "alive") {
        if (doer.role.isPestilence) continue;

        let alivePlayersCount = 0;
        let infectedCount = 0;
        for (let j = 0; j < players.length; j++) {
          if (players[j].status === "alive" && i != j) {
            if (players[j].infected) infectedCount++;
            alivePlayersCount++;
          }
        }

        if (infectedCount === alivePlayersCount) {
          this.group_session.players[i].addonMessage +=
            "☣️ Kamu telah menginfeksi seluruh orang! " + "Kamu telah menjadi Pestilence!";

          this.group_session.players[i].role.isPestilence = true;
          this.group_session.players[i].role.canKill = true;
        }

        break;
      }
    }
  }

  const botNames = util.getFakeData(14).map(item => {
    return item.name;
  });

  this.group_session.players.forEach((item, index) => {
    if (botNames.includes(item.name)) {
      rawRoles[item.role.name].botSkillAction(util, this.group_session, index);
    }
  });

  announcement += "⏳ Warga diberi waktu ";
  announcement += this.group_session.time_default + " detik ";
  announcement += "untuk menjalankan aksinya";

  let headerText = this.group_session.isFullMoon ? "🌕 " : "🌙 ";
  headerText += "Malam - " + this.group_session.nightCounter;

  const flex_text = {
    headerText,
    bodyText: announcement,
    buttons: [
      {
        action: "uri",
        label: "🚪 Pakai Skill",
        data: "https://line.me/R/oaMessage/" + process.env.BOT_ID + "/?%2Frole"
      }
    ]
  };

  runTimer();

  if (process.env.TEST === "true") {
    let playersWithRole = this.group_session.players.map(i => {
      return {
        name: i.name,
        roleName: i.role.name
      };
    });
    console.table(playersWithRole);
  }

  return replyFlex(flex_text);
};

const getTimeDefault = playersLength => {
  let time = 0;

  if (playersLength === 3) {
    time = 35;
  } else if (playersLength > 10) {
    time = 90;
  } else {
    // 4 - 9 players logic
    let temp = playersLength;
    while (temp) {
      time += 0.9;
      temp--;
    }
    time = Math.round(time) * 10;
  }

  return time;
};

const checkMorphingRole = (fromMorphRole, triggerRole, toMorphRole) => {
  /*
    fromMorphRole, role yang mau di cek, ini yang mau di ubah
    triggerRole, role yang jika tak ada, maka fromMoprhRole menjadi toMorphRole
    toMorphRole, role baru untuk fromMorphRole
  */

  if (checkExistsRole(fromMorphRole)) {
    if (!checkExistsRole(triggerRole)) {
      let willMorph = getPlayerIdByRole(fromMorphRole);
      let index = getPlayerIndexById(willMorph);

      let roleData = getRoleData(toMorphRole);

      this.group_session.players[index].role = roleData;

      /// special role morphing

      // from vampire-hunter to vigilante
      if (this.group_session.players[index].role.name === "vigilante") {
        this.group_session.players[index].role.bullet = 1;
        this.group_session.players[index].role.isLoadBullet = false;
      }

      this.group_session.players[index].addonMessage +=
        "💡 Role kamu menjadi " + toMorphRole + " karena sudah tidak ada " + triggerRole;
    }
  }
};

const getRoleData = roleName => {
  const rolesData = Object.keys(rawRoles);
  for (let i = 0; i < rolesData.length; i++) {
    if (roleName === rolesData[i]) {
      const roleData = rawRoles[rolesData[i]].getData();
      return JSON.parse(JSON.stringify(roleData));
    }
  }
};

const getPlayerIndexById = id => {
  for (let i = 0; i < this.group_session.players.length; i++) {
    if (id === this.group_session.players[i].id) {
      return i;
    }
  }
  return -1;
};

const getPlayerIdByRole = roleName => {
  for (let i = 0; i < this.group_session.players.length; i++) {
    if (this.group_session.players[i].role.name === roleName) {
      return this.group_session.players[i].id;
    }
  }
};

const checkExistsRole = roleName => {
  const players = this.group_session.players;
  for (let i = 0; i < players.length; i++) {
    if (players[i].role.name === roleName && players[i].status === "alive") {
      return true;
    }
  }
  return false;
};

const checkCommand = isAuto => {
  const state = this.group_session.state;
  const time = this.group_session.time;
  const name = this.user_session.name;

  if (!isAuto && indexOfPlayer() === -1) {
    return replyText(`💡 ${name}, kamu tidak bergabung kedalam game`);
  }

  switch (state) {
    case "night":
      if (time > 0) {
        return replyText(respond.checkNight(time));
      } else {
        return day();
      }

    case "day":
      return votingCommand();

    case "vote":
      if (time > 0) {
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
      return replyText("💡 " + name + ", belum ada game yang dibuat, ketik '/new'");
  }
};

const postLynch = () => {
  const lynched = this.group_session.lynched;

  if (!lynched) {
    return night(null);
  } else {
    if (this.group_session.mode === "vip") {
      const players = this.group_session.players;
      if (players[this.group_session.vipIndex].status === "death") {
        let flex_text = {
          headerText: "📜 Info",
          bodyText: `⭐ ${players[this.group_session.vipIndex].name} telah mati!`
        };
        return endGame(flex_text, "mafia");
      }
    }

    let someoneWin = checkVictory();

    if (someoneWin) {
      return endGame(null, someoneWin);
    } else {
      substituteMafia(lynched);
      return night(null);
    }
  }
};

const checkVictory = () => {
  let someoneWin = "";
  const players = this.group_session.players;
  let alivePeople = 0;

  // group
  let villagerCount = 0;
  let mafiaCount = 0;
  let vampireCount = 0;

  // solo
  let neutralsKilling = ["serial-killer", "arsonist", "werewolf", "juggernaut", "plaguebearer"];
  let neutralsKillingCount = 0;

  players.forEach(item => {
    if (item.status === "alive") {
      alivePeople++;
      if (item.role.team === "mafia") {
        mafiaCount++;
      } else if (item.role.team === "vampire") {
        vampireCount++;
      } else if (item.role.team === "villager") {
        villagerCount++;
      } else if (neutralsKilling.includes(item.role.team)) {
        neutralsKillingCount++;
      }
    }
  });

  // draw
  if (alivePeople === 0) {
    someoneWin = "draw";
  }

  /// mafia win
  if (mafiaCount > 0) {
    if (villagerCount <= 1 && !vampireCount && !neutralsKillingCount) {
      someoneWin = "mafia";
    }
  }

  if (mafiaCount > 0) {
    if (!villagerCount && vampireCount <= 1 && !neutralsKillingCount) {
      someoneWin = "mafia";
    }
  }

  /// Vampire win

  if (vampireCount > 0) {
    if (!mafiaCount && villagerCount <= 1 && !neutralsKillingCount) {
      someoneWin = "vampire";
    }
  }

  /// Villager win

  if (villagerCount > 0) {
    if (!mafiaCount && !vampireCount && !neutralsKillingCount) {
      someoneWin = "villager";
    }
  }

  /// neutralsKilling win
  if (neutralsKillingCount) {
    let neutralKillingRole = [];

    for (let i = 0; i < players.length; i++) {
      if (players[i].status === "alive") {
        if (neutralsKilling.includes(players[i].role.team)) {
          let killingRole = {
            teamName: players[i].role.team,
            priority: 0
          };

          if (players[i].role.team === "plaguebearer") {
            if (players[i].role.isPestilence) {
              killingRole.priority = 6;
            }
          } else if (players[i].role.team === "juggernaut") {
            killingRole.priority = 5;
          } else if (players[i].role.team === "werewolf") {
            killingRole.priority = 4;
          } else if (players[i].role.team === "arsonist") {
            killingRole.priority = 3;
          } else if (players[i].role.team === "serial-killer") {
            killingRole.priority = 2;
          }

          neutralKillingRole.push(killingRole);
        }
      }
    }

    let otherFactionCount = mafiaCount + vampireCount + villagerCount;

    if (otherFactionCount <= 1 && neutralsKillingCount === 1) {
      someoneWin = neutralKillingRole[0].teamName;
    } else if (!otherFactionCount && neutralsKillingCount === 2) {
      let sortedNeutrals = neutralKillingRole.sort((a, b) => b.priority - a.priority);
      someoneWin = sortedNeutrals[0].teamName;
    }
  }

  return someoneWin;
};

const endGame = (flex_texts, whoWin) => {
  let surviveTeam = [];
  const players = this.group_session.players;
  let headerText = "";

  const flex_text = {
    headerText: "",
    table: {
      headers: ["No.", "Name", "Role", "Status"],
      contents: []
    },
    buttons: [
      {
        action: "postback",
        label: "🔁 Main lagi?",
        data: "/new"
      }
    ]
  };

  let num = 1;
  for (let i = 0; i < players.length; i++) {
    let table_data = [];
    let roleTeam = players[i].role.team;
    let roleName = players[i].role.name;

    let name = "";

    if (players[i].status === "death") {
      name += "💀 " + players[i].name;
    } else {
      name += "😃 " + players[i].name;
    }

    table_data.push(`${num}.`, name, roleName);

    if (players[i].afkCounter >= 3) {
      table_data.push("lose");
      database.update(players[i].id, "lose", this.group_session);
    } else if (roleTeam === whoWin) {
      table_data.push("win");
      database.update(players[i].id, "win", this.group_session);
    } else {
      /// check the win condition of some role
      if (roleName === "jester") {
        handleJesterWin(i, table_data, surviveTeam);
      } else if (roleName === "survivor") {
        handleSurvivorWin(i, table_data, surviveTeam);
      } else if (roleName === "amnesiac") {
        table_data.push("lose");
        database.update(players[i].id, "lose", this.group_session);
      } else if (roleName === "executioner") {
        handleExecutionerWin(i, table_data, surviveTeam);
      } else if (roleName === "guardian-angel") {
        handleGuardianAngelWin(i, table_data, surviveTeam);
      } else if (whoWin === "draw") {
        table_data.push("draw");
        database.update(players[i].id, "draw", this.group_session);
      } else {
        table_data.push("lose");
        database.update(players[i].id, "lose", this.group_session);
      }
    }

    flex_text.table.contents.push(table_data);

    num++;
  }

  if (whoWin !== "draw") {
    let emoji = util.getRoleTeamEmoji(whoWin) + " ";
    headerText = "🎉 " + emoji + whoWin.toUpperCase() + " win! 🎉";
  } else if (surviveTeam.length > 0) {
    let surviveTeamList = surviveTeam.join(", ");
    headerText = "🎉 " + surviveTeamList.toUpperCase() + " win! 🎉";
  } else {
    headerText = "😶 Draw Game 😶";
  }

  flex_text.headerText = headerText;

  this.group_session.time = 300; // reset to init time
  this.group_session.state = "idle";
  delete this.group_session.nightCounter;
  delete this.group_session.lynched;
  delete this.group_session.vampireConvertCooldown;
  delete this.group_session.isFullMoon;
  delete this.group_session.punishment;
  delete this.group_session.roles;
  delete this.group_session.mafiaChat;
  delete this.group_session.vampireChat;
  delete this.group_session.vampireHunterChat;
  delete this.group_session.villagerCode;

  resetAllPlayers();

  if (!flex_texts) {
    return replyFlex(flex_text);
  } else {
    return replyFlex(flex_texts, null, flex_text);
  }
};

const handleGuardianAngelWin = (index, table_data, surviveTeam) => {
  let guardianAngel = this.group_session.players[index];
  let targetIndex = guardianAngel.role.mustProtectIndex;
  if (this.group_session.players[targetIndex].status === "alive") {
    table_data.push("win");
    surviveTeam.push("guardian angel 😇");
    database.update(this.group_session.players[index].id, "win", this.group_session);
  } else {
    table_data.push("lose");
    database.update(this.group_session.players[index].id, "lose", this.group_session);
  }
};

const handleExecutionerWin = (index, table_data, surviveTeam) => {
  if (this.group_session.players[index].role.isTargetLynched) {
    table_data.push("win");
    surviveTeam.push("executioner 🪓");
    database.update(this.group_session.players[index].id, "win", this.group_session);
  } else {
    table_data.push("lose");
    database.update(this.group_session.players[index].id, "lose", this.group_session);
  }
};

const handleSurvivorWin = (index, table_data, surviveTeam) => {
  if (this.group_session.players[index].status === "alive") {
    table_data.push("win");
    surviveTeam.push("survivor 🏳️");
    database.update(this.group_session.players[index].id, "win", this.group_session);
  } else {
    table_data.push("lose");
    database.update(this.group_session.players[index].id, "lose", this.group_session);
  }
};

const handleJesterWin = (index, table_data, surviveTeam) => {
  if (this.group_session.players[index].role.isLynched) {
    table_data.push("win");
    surviveTeam.push("jester 🤡");
    database.update(this.group_session.players[index].id, "win", this.group_session);
  } else {
    table_data.push("lose");
    database.update(this.group_session.players[index].id, "lose", this.group_session);
  }
};

const substituteMafia = checkTarget => {
  const players = this.group_session.players;
  // check mafia killing yang mati
  if (checkTarget.role.type === "Mafia Killing") {
    // check if alpha ww die, search a substitute
    if (checkTarget.role.name === "godfather") {
      checkMorphingRole("mafioso", "godfather", "godfather");
    }

    // check if there is no mafia killing left
    let isThereMafiaKillingLeft = false;
    for (let i = 0; i < players.length; i++) {
      if (players[i].status === "alive") {
        if (players[i].role.type === "Mafia Killing") {
          isThereMafiaKillingLeft = true;
          break;
        }
      }
    }
    if (!isThereMafiaKillingLeft) {
      // to mafioso
      checkMorphingRole("consort", "mafioso", "mafioso");
      checkMorphingRole("consigliere", "mafioso", "mafioso");
      checkMorphingRole("framer", "mafioso", "mafioso");
      checkMorphingRole("disguiser", "mafioso", "mafioso");
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

  const lynchedName = players[lynchTarget.index].name;
  let announcement = respond.punish(this.group_session.punishment, lynchedName, lynchTarget.count);

  const emoji = util.getRoleNameEmoji(roleName);
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
        const roleData = getRoleData("survivor");
        this.group_session.players[i].role = roleData;
        this.group_session.players[i].role.vest = 0;
        this.group_session.players[i].addonMessage = "💡 Targetmu mati, sekarang kamu hanyalah Survivor tanpa vest";
      }
    }
  }

  if (!flex_texts[0].body) {
    flex_texts[0].bodyText = announcement;
  } else {
    flex_texts[0].bodyText += "\n\n" + announcement;
  }

  this.group_session.state = "lynch";
  this.group_session.lynched = {
    role: {
      name: players[lynchTarget.index].role.name,
      type: players[lynchTarget.index].role.type
    }
  };
  this.group_session.time = 8;

  return replyFlex(flex_texts);
};

const voteCommand = (botIndex, botTargetIndex) => {
  if (this.group_session.state !== "vote") {
    return Promise.resolve(null);
  }

  const index = botIndex !== undefined ? botIndex : indexOfPlayer();
  const players = this.group_session.players;

  if (index === -1) {
    let text = "💡 " + this.user_session.name + ", kamu tidak join kedalam game";
    return replyText(text);
  }

  if (players[index].status !== "alive") {
    let text = "💡 " + players[index].name + ", kamu sudah mati";
    return replyText(text);
  }

  let targetIndex = botTargetIndex !== undefined ? botTargetIndex : this.args[1];

  if (targetIndex === undefined) {
    return votingCommand();
  }

  if (targetIndex == index) {
    let text = "💡 " + players[index].name + ", gak bisa vote diri sendiri";
    return replyText(text);
  }

  if (!players[targetIndex]) {
    return replyText("💡 " + players[index].name + ", invalid vote");
  }

  if (players[targetIndex].protected) {
    let targetName = players[targetIndex].name;
    let text = "⚔️ " + players[index].name + ", ";
    text += targetName + " immune dari vote karena perlindungan Guardian Angel!";
    return replyText(text);
  }

  let text = "☝️ " + players[index].name;

  if (players[index].targetVoteIndex === -1) {
    text += " vote ";
  } else if (players[index].targetVoteIndex === targetIndex) {
    text = "💡 " + players[index].name + ", kamu sudah vote ";
  } else {
    text += " mengganti vote ke ";
  }

  if (players[index].afkCounter > 0) {
    this.group_session.players[index].afkCounter = 0;
  }

  this.group_session.players[index].targetVoteIndex = targetIndex;

  text += players[targetIndex].name + " untuk di" + this.group_session.punishment;

  const voteNeeded = Math.round(getAlivePlayersCount() / 2);

  const headerText = "📣 Voting";

  const time = this.group_session.time;

  const checkVote = checkVoteStatus(voteNeeded);

  if (checkVote.status !== "enough_vote") {
    let voteFlex = "💡 Ketik '/cek' untuk munculin flex vote. ";

    if (time > 15) {
      voteFlex += "⏳ Waktu tersisa " + this.group_session.time + " detik lagi";
    }

    text += "\n" + voteFlex;

    // bot respond to vote
    const botIds = util.getFakeData(14).map(item => {
      return item.id;
    });

    let botText = "";
    if (botIds.includes(players[targetIndex].id)) {
      const bot = players[targetIndex];
      const botTargetIndex = bot.claimedRole.targetIndex;
      let voteIndex = -1;
      botText += "☝️ " + bot.name;

      if (botTargetIndex === -1 || players[botTargetIndex].status === "death") {
        voteIndex = index;
      } else {
        voteIndex = botTargetIndex;
      }

      if (bot.targetVoteIndex === voteIndex) {
        return replyText(text);
      }

      if (bot.targetVoteIndex === -1) {
        botText += " vote ";
      } else {
        botText += " mengganti vote ke ";
      }

      this.group_session.players[targetIndex].targetVoteIndex = voteIndex;

      botText += players[voteIndex].name + " untuk di" + this.group_session.punishment;
    }

    if (botText) {
      text = [text, botText];
    }

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
      let remindText = "💡 " + this.user_session.name + ", belum saatnya voting" + "\n";
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

  const voteNeeded = Math.round(getAlivePlayersCount() / 2);
  let voteNeededText = "\n" + "💡 Dibutuhkan " + voteNeeded;
  voteNeededText += " vote untuk " + this.group_session.punishment + " orang";

  let flexBodyText = "💀 Pilih siapa yang mau di" + this.group_session.punishment + "\n";
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
  let num = 1;
  players.forEach((item, index) => {
    if (item.status === "alive") {
      button[index] = {
        action: "postback",
        label: `${num}. ${item.name}`,
        data: `/vote_flex ${index}`
      };

      flex_text.buttons.push(button[index]);
      num++;
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
    text = "💬 Waktu habis dan warga belum menentukan siapa yang akan di" + this.group_session.punishment;
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
    headers: ["No.", "Name", "Status", "Vote"],
    contents: []
  };

  let num = 1;
  alivePlayers.forEach(voter => {
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

  const index = indexOfPlayer();

  if (index === -1) {
    let text = "💡 " + this.user_session.name;
    text += ", kamu tidak join kedalam game";
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

  const roomHostIndex = getPlayerIndexById(this.group_session.roomHostId);
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

  const state = this.group_session.state;
  const flex_text = util.getPlayersList(players, state);

  if (this.group_session.state === "new") {
    flex_text.buttons = [
      {
        action: "postback",
        label: "🚪 Join",
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
  const text = respond.kicked();
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
    const roomHostIndex = getPlayerIndexById(currentRoomHostId);
    const players = this.group_session.players;
    let text = "💡 Yang bisa stop game hanya Host Room saja. ";
    text += "👑 Host Room : " + players[roomHostIndex].name;
    return replyText(text);
  }

  this.group_session.state = "idle";
  this.group_session.time = 300; // reset to initial time
  delete this.group_session.nightCounter;
  delete this.group_session.lynched;
  delete this.group_session.vampireConvertCooldown;
  delete this.group_session.isFullMoon;
  delete this.group_session.punishment;
  delete this.group_session.roles;
  delete this.group_session.mafiaChat;
  delete this.group_session.vampireChat;
  delete this.group_session.vampireHunterChat;

  resetAllPlayers();

  const text = respond.stopGame(this.user_session.name);
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

  const botIds = util.getFakeData(14).map(item => {
    return item.id;
  });

  let hasHuman = false;
  const players = this.group_session.players;
  for (let i = 0; i < players.length; i++) {
    if (!botIds.includes(players[i].id)) {
      if (this.group_session.roomHostId === this.user_session.id) {
        let randomPlayer = util.random(this.group_session.players);
        this.group_session.roomHostId = randomPlayer.id;
        text += "\n" + "👑 " + randomPlayer.name;
        text += " menjadi host baru dalam room ini. ";
      }
      hasHuman = true;
      break;
    }
  }

  if (this.group_session.players.length === 0 || !hasHuman) {
    this.group_session.state = "idle";
    text += "\n" + "💡 Game di stop karena tidak ada pemain";
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

  database.add(this.user_session);

  let reminder = "⏳ Sisa waktu ";

  if (this.group_session.time > 90) {
    let minute = Math.round(this.group_session.time / 60);
    reminder += minute + " menit lagi";
  } else {
    reminder += this.group_session.time + " detik lagi";
  }

  let text = respond.join(this.user_session.name) + "\n" + reminder;

  if (this.group_session.players.length >= 5) {
    if (this.group_session.players.length === 15) {
      text += "\n" + "📣 Room sudah penuh, game bisa dimulai";
    } else {
      text += "\n" + respond.enoughPlayer();
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
  this.group_session.players = [];
  this.group_session.nightCounter = 0;
  this.group_session.roomHostId = "";
  this.group_session.time = 600;
  this.group_session.lynched = null;
  this.group_session.vampireConvertCooldown = 0;
  this.group_session.isFullMoon = false;
  this.group_session.hasBot = false;

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
        label: "🚪 Join",
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

  database.add(this.user_session);

  const text = respond.join(this.user_session.name);
  return replyFlex(flex_text, [text, remindText]);
};

const settingCommand = () => {
  const state = this.group_session.state;
  if (state !== "idle" && state !== "new") {
    let text = "💡 " + this.user_session.name;
    text += ", setting hanya bisa di atur saat game belum berjalan";
    return replyText(text);
  }

  return setting.receive(this.event, this.args, this.rawArgs, this.group_sessions, this.user_sessions);
};

const commandCommand = () => {
  const flex_texts = [];
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
    "/kick : keluarin bot",
    "/setting : liat settingan bot",
    "/tutorial : self explanatory",
    "/gamestat : status game yg berjalan",
    "/forum : link ke openchat",
    "/updates : untuk melihat 5 update terakhir bot",
    "/promote : open group dengan memberikan admin group",
    "/group : melihat list group yang open",
    "/rank : list top 10 pemain",
    "/me : info data diri sendiri",
    "/sync : sinkronisasi data pemain",
    "/addbot : nambahin bot kedalam game"
  ];

  let flexNeeded = 0;
  const limit = 8;
  let cnt = 0;
  cmds.forEach((item, index) => {
    cnt++;
    if (cnt === limit || index === cmds.length - 1) {
      flexNeeded++;
      cnt = 0;
    }
  });

  let startPoint = 0; //start
  let limitCheckPoint = 8 > cmds.length ? cmds.length : 8;

  let flex_text = {};
  for (let i = 0; i < flexNeeded; i++) {
    flex_text[i] = {
      headerText: "📚 Daftar Perintah",
      bodyText: ""
    };

    for (startPoint; startPoint < limitCheckPoint; startPoint++) {
      flex_text[i].bodyText += `- ${cmds[startPoint]}\n`;

      if (startPoint === limitCheckPoint - 1 || startPoint === cmds.length - 1) {
        flex_texts.push(flex_text[i]);

        if (limitCheckPoint < cmds.length) {
          let spaceLeft = cmds.length - startPoint + 1;
          let addonLimit = 8 > spaceLeft ? spaceLeft : 8;
          limitCheckPoint += addonLimit;
          startPoint++;
        }

        break;
      }
    }
  }

  return replyFlex(flex_texts);
};

const helpCommand = () => {
  const state = this.group_session.state;
  const flex_text = util.getHelp(state);
  return replyFlex(flex_text);
};

const statusCommand = async () => {
  const msg = await stats.statusCommand(this.user_sessions, this.group_sessions);
  return replyFlex(msg);
};

const infoCommand = () => {
  info.receive(this.event, this.args, this.rawArgs, this.group_session.state);
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
  const text = `💡 ${this.user_session.name}, command ${this.args[0]} hanya boleh dilakukan di pc bot`;
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
  if (util.hasBadWord(this.args[0])) {
    const randomImageLink = util.getBruhImage();
    return replyImage(randomImageLink);
  }

  const text = `💡 Tidak ditemukan perintah '${this.args[0]}'. Cek daftar perintah yang ada di '/cmd'`;
  return replyText(text);
};

/** helper func **/

const runTimer = () => {
  this.group_session.time = this.group_session.time_default;
};

const resetAllPlayers = () => {
  this.group_session.players.forEach(item => {
    if (this.user_sessions[item.id]) {
      this.user_sessions[item.id].state = "inactive";
      this.user_sessions[item.id].groupId = "";
      this.user_sessions[item.id].groupName = "";
    }
  });
  this.group_session.players = [];
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
    justInfected: false,
    skillResult: "",
    claimedRole: {
      name: "",
      targetIndex: -1,
      accusedRole: "",
      justDeadBaitIndex: -1
    },
    addonMessage: "",
    investigated: false
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

const pushFlex = async (userId, flex_raw) => {
  const sender = {
    name: "Moderator",
    iconUrl:
      "https://cdn.glitch.com/fc7de31a-faeb-4c50-8a38-834ec153f590%2F%E2%80%94Pngtree%E2%80%94microphone%20vector%20icon_3725450.png?v=1587456628843"
  };

  const msg = flex.build(flex_raw, sender);

  return await client.pushMessage(userId, msg).catch(err => {
    //console.log("err di pushFlex di main.js", err.originalError.response.data); //cp
  });
};

const replyImage = async imageLink => {
  return await client.replyMessage(this.event.replyToken, {
    type: "image",
    originalContentUrl: imageLink,
    previewImageUrl: imageLink
  });
};

const replyText = async (texts, bot) => {
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

  if (bot) {
    sender = {
      name: bot.name,
      iconUrl: util.getFakeData(null, bot.id).imageLink
    };
  }

  let msg = texts.map(text => {
    return {
      sender,
      type: "text",
      text: text.trim()
    };
  });

  return await client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log("err di replyText di main.js", err.originalError.response.data);
  });
};

const replyFlex = async (flex_raw, text_raw, new_flex_raw) => {
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
        reminder += "Waktu tersisa " + time + " detik lagi, nanti ketik '/cek' untuk lanjutkan proses";
      }

      const opt_text = {
        type: "text",
        text: reminder
      };
      opt_texts.push(opt_text);
    }
  } else {
    sender = util.getSender();
  }

  let msg = flex.build(flex_raw, sender, opt_texts);

  if (new_flex_raw) {
    const addonMsg = flex.build(new_flex_raw, sender);
    msg = Array.isArray(msg) ? msg : [msg];
    msg.push(addonMsg);
  }

  return await client.replyMessage(this.event.replyToken, msg).catch(err => {
    console.log(JSON.stringify(msg));
    console.error("err replyFlex di main.js", err.originalError.response.data.message);
  });
};

module.exports = {
  receive
};
