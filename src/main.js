const fs = require("fs");
const helper = require("/app/helper");
const attackedMsg = require("/app/message/attack");
const peaceMsg = require("/app/message/peace");
const punishment = require("/app/message/punishment");

module.exports = {
  receive: function(client, event, args, rawArgs, user_session, group_session) {
    this.client = client;
    this.event = event;
    this.args = args;
    this.rawArgs = rawArgs;
    this.user_session = user_session;
    this.group_session = group_session;

    if (!this.rawArgs.startsWith("/")) {
      let time = this.group_session.time;
      let state = this.group_session.state;

      if (state !== "idle") {
        if (state !== "new") {
          // special role yang bisa trigger lewat text biasa
          let players = this.group_session.players;
          let index = this.indexOfPlayer();
          if (index !== -1) {
            if (state === "day" || state === "vote") {
              let roleName = players[index].role.name;
              if (roleName === "mayor" && players[index].status === "alive") {
                let string = this.args.join(" ");
                string = string.toLowerCase();
                if (string.includes("mayor")) {
                  let subjects = ["aku", "ak", "gw", "gue", "gua", "saya"];

                  for (let i = 0; i < subjects.length; i++) {
                    if (string.indexOf(subjects[i]) !== -1) {
                      this.group_session.players[index].role.revealed = true;
                      let text = "🎩 " + players[index].name;
                      text += " telah mengungkapkan dirinya sebagai Mayor!";

                      let flex_text = {
                        header: {
                          text: "📜 Info"
                        },
                        body: {
                          text: text
                        }
                      };

                      return this.replyFlex(flex_text);
                    }
                  }
                }
              }
            }
          }

          if (time <= 10 && time > 0) {
            if (this.group_session.deadlineCheckChance === 0) {
              return Promise.resolve(null);
            } else {
              this.group_session.deadlineCheckChance--;
            }
            let reminder = "💡 Waktu tersisa " + time;
            reminder += " detik lagi, nanti ketik '/cek' ";
            reminder += "saat waktu sudah habis untuk lanjutkan proses";
            return this.replyText(reminder);
          } else if (time === 0) {
            if (this.indexOfPlayer() !== -1) {
              return this.checkCommand();
            }
          }
        } else {
          if (this.group_session.deadlineCheckChance === 0) {
            return Promise.resolve(null);
          }

          let playersLength = this.group_session.players.length;

          if (playersLength < 5) {
            if (time <= 40 && time > 0) {
              this.group_session.deadlineCheckChance--;
              let reminder = "💡 Waktu tersisa " + time;
              reminder +=
                " detik lagi. Jika tidak ada yang join, game akan dihentikan";
              return this.replyText(reminder);
            }
          }
        }
      }
      return Promise.resolve(null);
    }

    let input = this.args[0].toLowerCase();
    switch (input) {
      case "/new":
      case "/buat":
      case "/main":
      case "/play":
        return this.newCommand();
      case "/join":
      case "/j":
        return this.joinCommand();
      case "/cancel":
      case "/out":
      case "/quit":
      case "/keluar":
      case "/left":
        return this.cancelCommand();
      case "/start":
      case "/mulai":
      case "/gas":
      case "/anjing":
        return this.startCommand();
      case "/stop":
        return this.stopCommand();
      case "/cmd":
        return this.commandCommand();
      case "/help":
        return this.helpCommand();
      case "/gamestat":
        return this.gameStatCommand();
      case "/players":
      case "/player":
      case "/pemain":
      case "/p":
        return this.playersCommand();
      case "/check":
      case "/cek":
      case "/c":
      case "/cok":
        return this.checkCommand();
      case "/vote":
        return this.voteCommand();
      case "/about":
        return this.aboutCommand();
      case "/status":
        return this.statCommand();
      case "/info":
        return this.infoCommand();
      case "/roles":
      case "/rolelist":
        return this.roleListCommand();
      case "/tutorial":
        return this.tutorialCommand();
      case "/role":
      case "/news":
        return this.personalCommand();
      case "/skip":
        if (this.user_session.id === process.env.DEV_ID) {
          this.group_session.time = 0;
          this.checkCommand();
        } else {
          return this.invalidCommand();
        }
        break;
      case "/revoke":
        return this.revokeCommand();
      case "/extend":
        return this.extendCommand();
      case "/kick":
        return this.kickCommand();
      case "/set":
      case "/setting":
        return this.settingCommand();
      case "/skill":
        return this.skillCommand();
      case "/forum":
      case "/oc":
      case "/openchat":
        return this.forumCommand();
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

  gameStatCommand: function() {
    let state = this.group_session.state;
    let players = this.group_session.players;

    let bodyText = "";
    if (state === "idle") {
      return this.replyText("💡 Belum ada game yang dibuat");
    }

    bodyText += "🕹️ Game mode : " + this.group_session.mode + "\n\n";

    let roomHostIndex = this.getPlayerIndexById(this.group_session.roomHostId);
    let roomHostName = players[roomHostIndex].name;
    bodyText += "👑 Room Host : " + roomHostName;

    let flex_text = {
      header: {
        text: "🎮 Game Stat"
      },
      body: {
        text: ""
      }
    };

    if (state === "new") {
      flex_text.body.text = bodyText;
      return this.replyFlex(flex_text);
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

    flex_text.body.text = bodyText;
    return this.replyFlex(flex_text);
  },

  tutorialCommand: function() {
    let flex_text = helper.getTutorial();
    return this.replyFlex(flex_text);
  },

  skillCommand: function() {
    if (this.user_session.id !== process.env.DEV_ID) {
      return this.invalidCommand();
    }

    let doerIndex = this.args[1];
    let targetIndex = this.args[2];

    if (doerIndex === undefined || targetIndex === undefined) {
      return this.replyText("/skill doerIndex targetIndex");
    }

    this.group_session.players[doerIndex].target.index = targetIndex;
  },

  settingCommand: function() {
    let state = this.group_session.state;
    if (state !== "idle" && state !== "new") {
      let text = "💡 " + this.user_session.name;
      text += ", setting hanya bisa di atur saat game belum berjalan";
      return this.replyText(text);
    }

    const setting = require("/app/src/setting");
    return setting.receive(
      this.client,
      this.event,
      this.args,
      this.group_session,
      this.user_session
    );
  },

  kickCommand: function() {
    let groupId = this.group_session.groupId;
    let text = "👋 Selamat tinggal!";
    this.replyText(text);
    if (this.event.source.type === "group") {
      this.client.leaveGroup(groupId);
    } else {
      this.client.leaveRoom(groupId);
    }
  },

  extendCommand: function() {
    if (this.group_session.state !== "new") {
      let text = "";
      if (this.group_session.state === "idle") {
        text = "💡 Belum ada game yang dibuat, ketik '/new' untuk buat";
      } else {
        text = "💡 Waktu gak bisa ditambahkan saat game sudah berjalan";
      }
      return this.replyText(text);
    }

    this.group_session.time += 60;

    let remind = "⏳ Waktu berhasil di tambah 1 menit. ";
    remind += "Sisa waktu ";

    if (this.group_session.time > 90) {
      let minute = Math.round(this.group_session.time / 60);
      remind += minute + " menit lagi";
    } else {
      remind += this.group_session.time + " detik lagi";
    }

    return this.replyText(remind);
  },

  roleListCommand: function() {
    if (this.group_session.state === "idle") {
      return this.replyText("💡 Belum ada game yang dibuat, ketik '/new'");
    } else if (this.group_session.state === "new") {
      return this.replyText("💡 Game belum dimulai");
    }

    let roles = this.group_session.roles;
    let flex_text = {
      header: {
        text: "🤵 Role List 🕵️"
      },
      body: {
        text: roles.join(", ")
      }
    };
    return this.replyFlex(flex_text);
  },

  personalCommand: function() {
    let text = "💡 " + this.user_session.name + ", perintah ";
    text += this.args[0] + " harusnya digunakan di personal chat bot";
    return this.replyText(text);
  },

  infoCommand: function() {
    const roles = require("/app/roles/rolesInfo");
    let groupState = this.group_session.state;
    return roles.receive(this.client, this.event, this.args, groupState);
  },

  helpCommand: function() {
    const helpFlex = require("/app/message/help");
    let state = this.group_session.state;
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

  statCommand: function() {
    if (this.group_session.state !== "idle") {
      let text = "💡 Cek stat bisa dilakukan di pc bot atau ";
      text += "disaat sedang tidak ada room game yang aktif";
      return this.replyText(text);
    }

    const stats = require("/app/src/stats");
    stats.receive(this.client, this.event, this.args);
  },

  aboutCommand: function() {
    let flex_text = helper.getAbout();
    return this.replyFlex(flex_text);
  },

  revokeCommand: function() {
    let state = this.group_session.state;
    if (state !== "vote") {
      let text = "";
      if (state === "idle") {
        text = "💡 " + this.user_session.name;
        text += ", belum ada game yang dibuat, ketik '/new'";
      } else {
        text = "💡 " + this.user_session.name + ", belum saatnya voting";
      }
      return this.replyText(text);
    }

    let index = this.indexOfPlayer();

    if (index === -1) {
      let text = "💡 " + this.user_session.name;
      text += ", kamu belum join kedalam game";
      return this.replyText(text);
    }

    let players = this.group_session.players;

    if (players[index].status !== "alive") {
      let text = "💡 " + this.user_session.name + ", kamu sudah mati";
      return this.replyText(text);
    }

    if (players[index].targetVoteIndex === -1) {
      let text = "💡 " + this.user_session.name;
      text += ", kamu belum vote siapa - siapa";
      return this.replyText(text);
    }

    let pastTargetVoteName = players[players[index].targetVoteIndex].name;

    this.group_session.players[index].targetVoteIndex = -1;

    let text = "💡 " + this.user_session.name;
    text += " batal vote " + pastTargetVoteName;
    return this.replyText(text);
  },

  newCommand: function() {
    if (this.group_session.state !== "idle") {
      let text = "";
      if (this.group_session.state === "new") {
        text += "💡 " + this.user_session.name;
        text += ", sudah ada game yang dibuat di grup ini";
      } else {
        text += "💡 " + this.user_session.name + ", game sedang berjalan";
      }
      return this.replyText(text);
    }

    this.group_session.state = "new";
    this.group_session.players.length = 0;
    this.group_session.nightCounter = 0;
    this.group_session.roomHostId = "";
    this.group_session.time = 600;
    this.group_session.deadlineCheckChance = 1;
    this.group_session.checkChance = 1;
    this.group_session.lynched = null;
    this.group_session.vampireConvertCooldown = 0;
    this.group_session.isFullMoon = false;

    let flex_text = this.getNewStateFlex();

    let remindText = "⏳ Jika jumlah pemain kurang dari 5 dalam 10 menit, ";
    remindText += "game akan diberhentikan";

    /// nambah user auto
    if (this.user_session.state === "inactive") {
      this.group_session.roomHostId = this.user_session.id;
      this.user_session.state = "active";
      this.user_session.groupId = this.group_session.groupId;

      let newPlayer = this.createNewPlayer(this.user_session);
      this.addPlayer(newPlayer);

      if (process.env.TEST === "true") {
        // cp
        for (let i = 0; i < 8; i++) {
          let dummy = JSON.parse(JSON.stringify(this.user_session));
          dummy.name += " " + helper.getRandomInt(1, 99);
          let newPlayer = this.createNewPlayer(dummy);
          this.addPlayer(newPlayer);
        }
      }

      let text = "💡 " + this.user_session.name + " berhasil bergabung!";
      return this.replyFlex(flex_text, [text, remindText]);
    } else {
      return this.replyFlex(flex_text, remindText);
    }
  },

  joinCommand: function() {
    if (this.group_session.state !== "new") {
      let text = "";
      if (this.group_session.state === "idle") {
        text += "💡 " + this.user_session.name;
        text += ", belum ada game yang dibuat, ketik '/new'";
      } else {
        text += "💡 " + this.user_session.name + ", game sedang berjalan";
      }
      return this.replyText(text);
    }

    if (this.user_session.state === "active") {
      let text = "";
      if (this.user_session.groupId === this.group_session.groupId) {
        text += "💡 " + this.user_session.name;
        text += ", kamu sudah bergabung kedalam game";
      } else {
        text += "💡 " + this.user_session.name;
        text += ", kamu masih berada didalam game grup lain";
      }
      return this.replyText(text);
    }

    if (this.group_session.players.length === 0) {
      this.group_session.roomHostId = this.user_session.id;
    }

    if (this.group_session.players.length === 15) {
      let text = "💡 " + this.user_session.name;
      text += ", room sudah penuh";
      return this.replyText(text);
    }

    this.user_session.state = "active";
    this.user_session.groupId = this.group_session.groupId;

    let newPlayer = this.createNewPlayer(this.user_session);

    this.addPlayer(newPlayer);

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

    return this.replyText(text);
  },

  playersCommand: function() {
    if (this.group_session.state === "idle") {
      return this.replyText("💡 Belum ada game yang dibuat, ketik '/new'");
    }

    let players = this.group_session.players;
    if (players.length === 0) {
      return this.replyText("💡 Belum ada pemain, ketik '/join' utk bergabung");
    }

    let flex_text = {
      header: {
        text: "🤵 Daftar Pemain 👨‍🌾"
      },
      table: {
        header: {
          addon: ""
        },
        body: []
      }
    };

    let table_body = {};

    let num = 1;

    players.forEach((item, index) => {
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
            flex: 3,
            wrap: true
          },
          {
            type: "text",
            text: "",
            flex: 1,
            align: "center"
          }
        ],
        margin: "sm"
      };

      table_body[index].contents[0].text += num + ".";
      table_body[index].contents[1].text += item.name;

      if (item.status === "death") {
        table_body[index].contents[2].text += "💀";
      } else {
        table_body[index].contents[2].text += "😃";
      }

      if (this.group_session.state !== "new") {
        flex_text.table.header.addon = "Role";

        let role = {
          type: "text",
          text: "???",
          flex: 2,
          align: "center",
          wrap: true
        };

        if (item.status === "death") {
          role.text = item.role.name;

          if (item.role.disguiseAs) {
            role.text = item.role.disguiseAs;
          }
        }

        table_body[index].contents.push(role);
      }

      num++;

      flex_text.table.body.push(table_body[index]);
    });

    if (this.group_session.state === "new") {
      flex_text.footer = {
        buttons: [
          {
            action: "postback",
            label: "join",
            data: "/join"
          }
        ]
      };
    }

    return this.replyFlex(flex_text);
  },

  cancelCommand: function() {
    if (this.group_session.state !== "new") {
      let text = "";
      if (this.group_session.state === "idle") {
        text += "💡 Belum ada game yang dibuat, ketik '/new'";
      } else {
        text += "💡 " + this.user_session.name + ", game sedang berjalan. ";
      }
      return this.replyText(text);
    }

    let index = this.indexOfPlayer();

    if (index === -1) {
      let text = "💡 " + this.user_session.name;
      text += ", kamu belum join kedalam game";
      return this.replyText(text);
    }

    helper.cutFromArray(this.group_session.players, index);

    let text = "💡 " + this.user_session.name + " telah meninggalkan game. ";

    if (this.group_session.players.length === 0) {
      this.group_session.state = "idle";
      text += "\n" + "💡 Game di stop karena tidak ada pemain";
    } else {
      if (this.group_session.roomHostId === this.user_session.id) {
        let randomPlayer = helper.random(this.group_session.players);
        this.group_session.roomHostId = randomPlayer.id;
        text += "\n" + "👑 " + randomPlayer.name;
        text += " menjadi host baru dalam room ini. ";
      }
    }

    this.resetUser();

    return this.replyText(text);
  },

  stopCommand: function() {
    if (this.group_session.state === "idle") {
      return this.replyText("💡 Belum ada game yang dibuat, ketik '/new'");
    }

    let index = this.indexOfPlayer();

    if (index === -1) {
      let text = "💡 " + this.user_session.name;
      text += ", kamu belum join kedalam game";
      return this.replyText(text);
    }

    if (this.user_session.id !== this.group_session.roomHostId) {
      let currentRoomHostId = this.group_session.roomHostId;
      let roomHostIndex = this.getPlayerIndexById(currentRoomHostId);
      let players = this.group_session.players;
      let text = "💡 Yang bisa stop game hanya Host Room saja. ";
      text += "👑 Host Room : " + players[roomHostIndex].name;
      return this.replyText(text);
    }

    this.group_session.state = "idle";
    this.group_session.time = 300; // reset to initial time

    this.resetAllPlayers();

    let text = "💡 Game telah di stop " + this.user_session.name;
    return this.replyText(text);
  },

  startCommand: function() {
    if (this.group_session.state !== "new") {
      let text = "";
      if (this.group_session.state === "idle") {
        text += "💡 Belum ada game yang dibuat, ketik '/new'";
      } else {
        text += "💡 " + this.user_session.name + ", game sudah berjalan";
      }
      return this.replyText(text);
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;

    if (index === -1) {
      let text = "💡 " + this.user_session.name;
      text += ", kamu belum join kedalam game";
      return this.replyText(text);
    }

    if (players.length < 5) {
      let text = "💡 Game belum bisa dimulai, minimal memiliki 5 pemain";
      return this.replyText(text);
    }

    this.group_session.punishment = helper.random(punishment);

    this.randomRoles();
  },

  randomRoles: function() {
    let players = this.group_session.players;
    let playersLength = players.length;
    let roles = this.getRandomRoleSet(playersLength);

    /// test specific role cp
    if (process.env.TEST === "true") {
      roles = [
        "mafioso",
        "werewolf",
        "doctor",
        "veteran",
        "bodyguard",
        "spy",
        "godfather"
      ];
    }

    /// hax for exe
    let exeIndex = -1;

    // this.group_session.players = helper.shuffleArray(
    //   this.group_session.players
    // );

    this.group_session.players.forEach((item, index) => {
      if (index <= roles.length - 1) {
        item.role.name = roles[index];
      }

      item.role = this.getRoleData(item.role.name);

      // disini bagi role pake pushMessage
      // if (this.group_session.groupId === process.env.TEST_GROUP) {
      //   // this.client.pushMessage();
      // }
    });

    // this.group_session.players = helper.shuffleArray(
    //   this.group_session.players
    // );

    this.group_session.players.forEach((item, index) => {
      /// init private prop special role
      switch (item.role.name) {
        case "executioner":
          exeIndex = index;
          break;
      }
    });

    /// special exe hax
    if (exeIndex !== -1) {
      this.group_session.players[
        exeIndex
      ].role.targetLynchIndex = this.getExecutionerTargetIndex(exeIndex);
      this.group_session.players[exeIndex].role.isTargetLynched = false;
    }

    /// untuk role yang berubah-berubah

    // vampire hunter to vigi
    this.checkMorphingRole("vampire-hunter", "vampire", "vigilante");

    // set roles list
    this.group_session.roles = this.getRoleList();

    this.night(null);
  },

  getRandomRoleSet: function(playersLength) {
    let mode = this.group_session.mode;
    let roles = [];

    if (mode === "classic") {
      roles = helper.getClassicRoleSet(playersLength);
    } else if (mode === "chaos") {
      roles = helper.getChaosRoleSet(playersLength);
    } else if (mode === "vampire") {
      roles = helper.getVampireRoleSet(playersLength);
    } else if (mode === "survive") {
      roles = helper.getSurviveRoleSet(playersLength);
    } else if (mode === "killing-wars") {
      roles = helper.getKillingWarsRoleSet(playersLength);
    } else if (mode === "who's-there") {
      roles = helper.getWhosThereRoleSet(playersLength);
    } else if (mode === "trust-issue") {
      roles = helper.getTrustIssueRoleSet(playersLength);
    } else if (mode === "who-are-you") {
      roles = helper.getWhoAreYou(playersLength);
    } else if (mode === "new-threat") {
      roles = helper.getNewThreat(playersLength);
    } else if (mode === "clown-town") {
      roles = helper.getClownTown(playersLength);
    }

    return roles;
  },

  night: function(flex_texts) {
    this.group_session.nightCounter++;

    this.group_session.state = "night";

    if (this.group_session.nightCounter % 2 == 0) {
      this.group_session.isFullMoon = true;
    } else {
      this.group_session.isFullMoon = false;
    }

    /// special role chat
    this.group_session.mafiaChat = [];
    this.group_session.vampireChat = [];
    this.group_session.vampireHunterChat = [];

    // set prop yang reset tiap malamnya (TEMPORARY prop)
    this.group_session.players.forEach((item, index) => {
      // all player regardless alive or not
      item.message = "";

      // only alive player
      if (item.status === "alive") {
        item.target = {
          index: -1,
          value: 1
        };
        item.attacked = false;
        item.healed = false;
        item.targetVoteIndex = -1;
        item.vampireBited = false;
        item.visitors = [];
        item.blocked = false;
        item.attackers = [];
        item.protectors = [];
        item.intercepted = false;
        item.vested = false;
        item.guarded = false;
        item.bugged = false;
        item.framed = false;
        item.selfHeal = false;
        item.damage = 0;

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
    this.checkMorphingRole("vampire-hunter", "vampire", "vigilante");

    let alivePlayersCount = this.getAlivePlayersCount();
    this.group_session.time_default = this.getTimeDefault(alivePlayersCount);
    this.group_session.time = this.group_session.time_default;

    //tell available role
    let announcement = "";
    announcement +=
      "📣 Role yang ada di game ini bisa cek di '/roles'. " + "\n\n";

    if (this.group_session.nightCounter === 1) {
      announcement +=
        "💡 Jangan lupa ketik '/role' di pc bot untuk menggunakan skill" +
        "\n\n";

      const firstDayNaration = require("/app/message/firstDay");
      announcement += firstDayNaration + "\n\n";
    } else {
      announcement +=
        "🏘️ 🛏️ Setiap warga kembali kerumah masing-masing" + "\n\n";
    }

    if (this.group_session.isFullMoon) {
      announcement +=
        "🌕 Bulan terlihat indah malam ini, bulan purnama!" + "\n\n";
    }

    announcement +=
      "⏳ Waktu yang diberikan " + this.group_session.time_default + " detik";

    let newFlex_text = this.getNightStateFlex(announcement);

    this.runTimer();

    if (process.env.TEST === "true") {
      let playersWithRole = this.group_session.players.map(i => {
        return {
          name: i.name,
          roleName: i.role.name
        };
      });
      console.table(playersWithRole);
    }

    if (flex_texts) {
      return this.replyFlex(flex_texts, null, newFlex_text);
    } else {
      return this.replyFlex(newFlex_text);
    }
  },

  checkCommand: function() {
    let state = this.group_session.state;
    let time = this.group_session.time;
    let name = this.user_session.name;

    if (state !== "idle" && state !== "new") {
      if (this.indexOfPlayer() === -1) {
        let text = "💡 " + name + ", kamu belum join kedalam game";
        return this.replyText(text);
      }

      if (time > 0) {
        if (state !== "vote") {
          if (this.group_session.checkChance === 0) {
            return Promise.resolve(null);
          } else {
            this.group_session.checkChance--;
          }
        }
      }
    }

    // console.log("state sebelumnya : " + state);

    switch (state) {
      case "night":
        if (time > 0) {
          let remindText =
            "⏳ Sisa waktu " + time + " detik lagi untuk menyambut mentari. ";
          remindText +=
            "💡 Kesempatan check : " + this.group_session.checkChance;
          return this.replyText(remindText);
        } else {
          return this.day();
        }
        break;

      case "day":
        return this.votingCommand();

      case "vote":
        if (time > 0) {
          //munculin button player-player sama kasih tau waktu tersisa berapa detik
          return this.votingCommand();
        } else {
          return this.autoVote();
        }
        break;

      case "lynch":
        if (time === 0) {
          return this.postLynch();
        }
        break;

      case "new":
        let text = "⏳ " + name + ", sisa waktu ";
        if (time > 90) {
          let minute = Math.round(time / 60);
          text += minute + " menit lagi ";
        } else {
          text += time + " detik lagi ";
        }
        text += "untuk memulai game";

        let flex_text = this.getNewStateFlex();

        return this.replyFlex(flex_text, text);

      default:
        return this.replyText(
          "💡 " + name + ", belum ada game yang dibuat, ketik '/new'"
        );
    }
  },

  autoVote: function() {
    let players = this.group_session.players;
    let voteNeeded = Math.round(this.getAlivePlayersCount() / 2);

    let headerText = "";
    let text = "";
    let flex_text = {
      header: {
        text: ""
      },
      body: {
        text: ""
      }
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

    let checkVote = this.checkVote(voteNeeded);

    if (checkVote.status !== "enough_vote") {
      headerText = "📣 Penghukuman ditunda";
      text =
        "💬 Waktu habis dan warga belum menentukan siapa yang akan di" +
        this.group_session.punishment;
    } else {
      headerText = "📣 Voting";
    }

    let alivePlayers = this.getAlivePlayers();
    let playerListFlex = this.getTableFlex(alivePlayers, null, headerText);

    if (checkVote.status !== "enough_vote") {
      this.group_session.state = "lynch";
      this.group_session.time = 8;
      this.resetCheckChance();

      flex_text.header.text = headerText;
      flex_text.body.text = text;
      return this.replyFlex([flex_text, playerListFlex]);
    } else {
      flex_text.header.text = headerText;
      return this.lynch([flex_text, playerListFlex]);
    }
  },

  day: function() {
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
        let noSkillRoles = ["villager", "jester", "executioner", "mayor"];

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

    /// Veteran targetIndexes
    let veteranTargetIndexes = [];

    /// vigilante check existences
    let vigilanteExists = this.checkExistsRole("vigilante");

    /// Executioner global var
    let exeIndex = -1;
    let isExecutionerTargetDie = false;

    /// Spy global var
    let spyMafiaVisitInfo = "";
    let spyBuggedInfo = {};

    /// Spy lock target action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];
      if (doer.role.name === "spy" && doer.status === "alive") {
        let targetIndex = doer.target.index;

        if (targetIndex !== -1) {
          this.group_session.players[targetIndex].bugged = true;
          spyBuggedInfo[targetIndex] = "";
        }
      }
    }

    /// Vampire Action
    // search the vampire that responsible to bite
    // note: the youngest
    let vampireExists = this.checkExistsRole("vampire");
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
        if (
          item.role.name === "vampire" &&
          item.status === "alive" &&
          item.target.index !== -1
        ) {
          vampireCandidates.push(item.target.index);
          if (item.target.value > 1) {
            vampireCandidates.push(item.target.index);
          }
        }
      });

      if (vampireCandidates.length > 0) {
        let vampireChosenTarget = helper.getMostFrequent(vampireCandidates);

        if (vampireCandidates.length === 1) {
          vampireChosenTarget = {
            index: vampireCandidates[0]
          };
        } else {
          if (vampireChosenTarget.index === undefined) {
            helper.shuffleArray(vampireCandidates);
            vampireChosenTarget = {
              index: vampireCandidates[0]
            };
            vampireAnnouncement +=
              "Para Vampire memiliki target yang berbeda, sehingga random pilih" +
              "\n";
          }
        }

        this.group_session.players[vampireDoerIndex].target.index =
          vampireChosenTarget.index;
      } else {
        this.group_session.players[vampireDoerIndex].target.index = -1;
      }
    }

    /// Mafia Action
    // search the mafia that responsible to bite
    // note: the mafioso if possible, if there is none, godfather itself
    let mafiaKillingExists =
      this.checkExistsRole("godfather") || this.checkExistsRole("mafioso");
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
        let doer = players[i];
        let status = doer.status;
        let roleName = doer.role.name;
        if (roleName === "godfather" && status === "alive") {
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
          let doer = players[i];
          let roleName = doer.role.name;
          if (roleName === "mafioso" || roleName === "godfather") {
            this.group_session.players[i].message +=
              "💡 Kamu tidak menggunakan skill mu" + "\n\n";
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
          let mafiaChosenTarget = helper.getMostFrequent(mafiaCandidates);

          if (mafiaCandidates.length === 1) {
            mafiaChosenTarget = {
              index: mafiaCandidates[0]
            };
          } else {
            if (mafiaChosenTarget.index === undefined) {
              helper.shuffleArray(mafiaCandidates);
              mafiaChosenTarget = {
                index: mafiaCandidates[0]
              };
              mafiaAnnouncement +=
                "Para Mafia memiliki target yang berbeda, sehingga random pilih" +
                "\n";
            }
          }

          this.group_session.players[mafiaDoerIndex].target.index =
            mafiaChosenTarget.index;

          let doer = players[mafiaDoerIndex];
          let target = players[mafiaChosenTarget.index];
          mafiaAnnouncement += `🤵 ${doer.name} akan membunuh ${target.name}\n\n`;
        }
      }
    }

    /// Escort Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "escort" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else if (!doer.attacked) {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            let visitor = {
              name: doer.name,
              role: doer.role
            };
            this.group_session.players[targetIndex].visitors.push(visitor);

            let immuneToRoleBlock = ["escort", "consort", "veteran"];

            if (this.group_session.isFullMoon) {
              immuneToRoleBlock.push("werewolf");
            }

            if (target.role.name === "serial-killer") {
              this.group_session.players[i].message +=
                "💡 Target kamu immune!" + "\n\n";

              this.group_session.players[targetIndex].message +=
                "💡 Ada yang berusaha role block kamu!" + "\n\n";

              this.group_session.players[targetIndex].intercepted = true;

              this.group_session.players[targetIndex].target.index = i;

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] +=
                  "🔍 Ada yang mencoba roleblock Target kamu, hingga Targetmu menyerang nya!" +
                  "\n\n";
              }
            } else if (immuneToRoleBlock.includes(target.role.name)) {
              this.group_session.players[i].message +=
                "💡 Target kamu immune!" + "\n\n";

              this.group_session.players[targetIndex].message +=
                "💡 Ada yang berusaha role block kamu!" + "\n\n";

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] +=
                  "🔍 Ada yang mencoba roleblock Target kamu tapi targetmu immune dari roleblock!" +
                  "\n\n";
              }
            } else {
              this.group_session.players[targetIndex].blocked = true;

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] +=
                  "🔍 Target kamu di roleblock sehingga dia diam dirumah saja!" +
                  "\n\n";
              }

              /// langsung kasih pesannya aja
              if (targetIndex === mafiaDoerIndex) {
                if (isBackupMafiaUseSkill) {
                  this.group_session.players[mafiaDoerIndex].message +=
                    "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
                    "\n\n";
                }
              }
            }
          }
        }
      }
    }

    /// Consort Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "consort" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else if (!doer.attacked) {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            mafiaAnnouncement += `🚷 ${doer.name} berencana block skill ${target.name}\n\n`;

            let visitor = {
              name: doer.name,
              role: doer.role
            };
            this.group_session.players[targetIndex].visitors.push(visitor);

            let immuneToRoleBlock = ["escort", "consort", "veteran"];

            if (this.group_session.isFullMoon) {
              immuneToRoleBlock.push("werewolf");
            }

            if (target.role.name === "serial-killer") {
              this.group_session.players[i].message +=
                "💡 Target kamu immune!" + "\n\n";

              this.group_session.players[targetIndex].message +=
                "💡 Ada yang berusaha role block kamu!" + "\n\n";

              this.group_session.players[targetIndex].intercepted = true;

              this.group_session.players[targetIndex].target.index = i;

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] +=
                  "🔍 Ada yang mencoba roleblock Target kamu, hingga Targetmu menyerang nya!" +
                  "\n\n";
              }
            } else if (immuneToRoleBlock.includes(target.role.name)) {
              this.group_session.players[i].message +=
                "💡 Target kamu immune!" + "\n\n";

              this.group_session.players[targetIndex].message +=
                "💡 Ada yang berusaha role block kamu!" + "\n\n";

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] +=
                  "🔍 Ada yang mencoba roleblock Target kamu tapi targetmu immune dari roleblock!" +
                  "\n\n";
              }
            } else {
              this.group_session.players[targetIndex].blocked = true;

              spyMafiaVisitInfo += `🤵 ${target.name} dikunjungi anggota Mafia\n\n`;

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] +=
                  "🔍 Target kamu di roleblock sehingga dia diam dirumah saja!" +
                  "\n\n";
              }

              /// langsung kasih pesannya aja
              if (targetIndex === mafiaDoerIndex) {
                if (isBackupMafiaUseSkill) {
                  this.group_session.players[mafiaDoerIndex].message +=
                    "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
                    "\n\n";
                }
              }
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
        let pastTarget = players[pastTargetIndex];

        if (isBackupMafiaUseSkill && mafiaDoerBackupIndex !== -1) {
          mafiaDoerIndex = mafiaDoerBackupIndex;
          this.group_session.players[
            mafiaDoerIndex
          ].target.index = pastTargetIndex;
        }
      }
    }

    /// Disguiser Action
    // jangan dipindah di bawah veteran
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "disguiser" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else if (!doer.attacked) {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            mafiaAnnouncement += `🎭 ${doer.name} akan mengimitasi role ${target.name}\n\n`;

            // hax for check if the target was veteran
            if (target.role.name === "veteran" && target.target.index !== -1) {
              continue;
            }

            let visitor = {
              name: doer.name,
              role: doer.role
            };
            this.group_session.players[targetIndex].visitors.push(visitor);

            this.group_session.players[i].role.disguiseAs = target.role.name;

            spyMafiaVisitInfo += `🤵 ${target.name} dikunjungi anggota Mafia\n\n`;
          }
        }
      }
    }

    /// Vampire Action
    // jangan dipindah di bawah veteran
    for (let i = 0; i < players.length; i++) {
      if (vampireDoerIndex === i) {
        let doer = players[i];
        let roleName = doer.role.name;
        let status = doer.status;
        let targetIndex = doer.target.index;

        if (
          roleName === "vampire" &&
          status === "alive" &&
          targetIndex !== -1
        ) {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            break;
          } else if (!doer.attacked) {
            let target = players[targetIndex];

            // hax for check if the target was veteran
            if (target.role.name === "veteran" && target.target.index !== -1) {
              break;
            }

            let visitor = {
              name: doer.name,
              role: doer.role
            };
            this.group_session.players[targetIndex].visitors.push(visitor);

            vampireAnnouncement += `🧛 Target Vampire adalah ${target.name}\n\n`;

            // hax for vampire if it only one vampire
            if (vampires.length === 1) {
              this.group_session.players[i].message +=
                "👣 Kamu ke rumah " + target.name + "\n\n";
            } else {
              this.group_session.players[i].message +=
                "👣 Kamu disuruh ke rumah " + target.name + "\n\n";
            }

            vampireAnnouncement += `👣 ${doer.name} mengunjungi rumah ${target.name}\n\n`;

            this.group_session.players[targetIndex].message +=
              "🧛 Kamu didatangi Vampire!" + "\n\n";

            let targetRoleName = target.role.name;
            let targetRoleTeam = target.role.team;

            let immuneToVampireBite = [
              "godfather",
              "vampire-hunter",
              "serial-killer",
              "arsonist",
              "executioner",
              "werewolf"
            ];

            let canAttacked = [
              "mafioso",
              "consigliere",
              "consort",
              "framer",
              "disguiser"
            ];

            if (immuneToVampireBite.includes(targetRoleName)) {
              this.group_session.players[i].message +=
                "💡 Target kamu kebal dari gigitan!" + "\n\n";

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] +=
                  "🔍 Target kamu diserang tapi serangan tersebut tidak mempan!" +
                  "\n\n";
              }

              if (targetRoleName === "vampire-hunter") {
                this.group_session.players[targetIndex].intercepted = true;

                this.group_session.players[targetIndex].target.index = i;
              }
            } else if (
              canAttacked.includes(targetRoleName) ||
              vampireAttackMode
            ) {
              this.group_session.players[i].message +=
                "💡 Kamu menyerang " + target.name + "\n\n";

              this.group_session.players[targetIndex].message +=
                "🧛 Kamu diserang " + doer.role.name + "!" + "\n\n";

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] +=
                  "🔍 Target kamu di serang Vampire!" + "\n\n";
              }

              this.group_session.players[targetIndex].attacked = true;

              let attacker = {
                index: i,
                name: doer.name,
                role: doer.role,
                deathNote: doer.deathNote,
                countered: false
              };

              this.group_session.players[targetIndex].attackers.push(attacker);
            } else {
              this.group_session.players[i].message +=
                "💡 Kamu gigit " + target.name + "\n\n";

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] +=
                  "🔍 Target kamu digigit Vampire!" + "\n\n";
              }

              this.group_session.players[targetIndex].vampireBited = true;

              let attacker = {
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

    /// Juggernaut Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];
      let roleName = doer.role.name;
      let status = doer.status;
      let targetIndex = doer.target.index;

      if (roleName === "juggernaut" && status === "alive") {
        let skillLevel = doer.role.skillLevel;
        if (!this.group_session.isFullMoon && skillLevel === 0) continue;

        if (doer.blocked) {
          this.group_session.players[i].message +=
            "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
            "\n\n";

          continue;
        }

        if (doer.target.index !== -1) {
          let visitor = {
            name: doer.name,
            role: doer.role
          };
          this.group_session.players[targetIndex].visitors.push(visitor);

          this.group_session.players[i].message +=
            "👣 Kamu ke rumah " + players[targetIndex].name;

          if (skillLevel > 2) {
            this.group_session.players[i].message +=
              " dan RAMPAGE di rumahnya" + "\n\n";
          } else {
            this.group_session.players[i].message += "\n\n";
          }
        }

        let immuneToBasicAttack = [
          "serial-killer",
          "arsonist",
          "godfather",
          "executioner"
        ];

        if (this.group_session.isFullMoon) {
          immuneToBasicAttack.push("werewolf");
        }

        /// skill level 0
        if (skillLevel < 3) {
          // kalau udah skill level 3, itu diam di rmh rampage sendiri
          if (doer.target.index === -1) {
            this.group_session.players[i].message +=
              "💡 Kamu tidak menggunakan skill mu" + "\n\n";

            continue;
          } else {
            // skill level 0 dan 1

            if (immuneToBasicAttack.includes(players[targetIndex].role.name)) {
              this.group_session.players[i].message +=
                "💡 Target kamu immune dari serangan!" + "\n\n";

              this.group_session.players[targetIndex].message +=
                "💡 Ada yang menyerang kamu tapi kamu immune dari serangan!" +
                "\n\n";

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] +=
                  "🔍 Target kamu di serang tapi serangan tersebut tidak mempan!" +
                  "\n\n";
              }
            } else {
              this.group_session.players[i].message +=
                "💡 Kamu menyerang " + players[targetIndex].name + "\n\n";

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] +=
                  "🔍 Target kamu di serang Juggernaut!" + "\n\n";
              }

              this.group_session.players[targetIndex].message +=
                "💪 Kamu diserang " + roleName + "!" + "\n\n";

              this.group_session.players[targetIndex].attacked = true;

              let attacker = {
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

          if (targetIndex === -1) {
            this.group_session.players[i].message +=
              "👣 Kamu diam di rumah dan akan menyerang siapa yang datang" +
              "\n\n";
          } else {
            let juggernautRampageTargetIndexes = [targetIndex];
            let rampagePlaceIndex = targetIndex;

            for (let i = 0; i < players.length; i++) {
              let visitor = players[i];

              if (visitor == doer) continue;

              if (visitor.status !== "alive") continue;

              if (visitor.blocked) continue;

              if (
                visitor.target.index !== -1 &&
                visitor.target.index === rampagePlaceIndex
              ) {
                // hax mafia kalo yang pergi itu mafioso
                if (visitor.role.name === "godfather") {
                  if (mafiaDoerIndex !== i) continue;
                }

                juggernautRampageTargetIndexes.push(i);
              }
            }

            // Juggernaut Killing Action
            for (let u = 0; u < juggernautRampageTargetIndexes.length; u++) {
              let targetIndex = juggernautRampageTargetIndexes[u];
              let targetRoleName = players[targetIndex].role.name;

              if (skillLevel < 4) {
                if (
                  immuneToBasicAttack.includes(players[targetIndex].role.name)
                ) {
                  this.group_session.players[i].message +=
                    "💡 Kamu menyerang seseorang tapi dia immune dari serangan!" +
                    "\n\n";

                  this.group_session.players[targetIndex].message +=
                    "💡 Ada yang menyerang kamu tapi kamu immune dari serangan!" +
                    "\n\n";

                  if (players[targetIndex].bugged) {
                    spyBuggedInfo[targetIndex] +=
                      "🔍 Target kamu di serang tapi serangan tersebut tidak mempan!" +
                      "\n\n";
                  }
                  continue;
                }
              }

              this.group_session.players[i].message +=
                "💡 Kamu menyerang seseorang!" + "\n\n";

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] +=
                  "🔍 Target kamu di serang Juggernaut!" + "\n\n";
              }

              this.group_session.players[targetIndex].message +=
                "💪 Kamu diserang " + roleName + "!" + "\n\n";

              this.group_session.players[targetIndex].attacked = true;

              let attacker = {
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

    /// Werewolf Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];
      let roleName = doer.role.name;
      let status = doer.status;
      let targetIndex = doer.target.index;

      if (roleName === "werewolf" && status === "alive") {
        if (!this.group_session.isFullMoon) continue;

        let werewolfRampageTargetIndexes = [];
        let rampagePlaceIndex = targetIndex;

        if (i != targetIndex && targetIndex != -1) {
          werewolfRampageTargetIndexes.push(targetIndex);
          let visitor = {
            name: doer.name,
            role: doer.role
          };
          this.group_session.players[targetIndex].visitors.push(visitor);

          this.group_session.players[i].message +=
            "👣 Kamu ke rumah " +
            players[targetIndex].name +
            " dan RAMPAGE di rumahnya" +
            "\n\n";
        } else {
          this.group_session.players[i].message +=
            "👣 Kamu diam di rumah dan akan menyerang siapa yang datang" +
            "\n\n";
        }

        for (let i = 0; i < players.length; i++) {
          let visitor = players[i];

          if (visitor == doer) continue;

          if (visitor.status !== "alive") continue;

          if (visitor.blocked) continue;

          if (
            visitor.target.index !== -1 &&
            visitor.target.index === rampagePlaceIndex
          ) {
            // hax mafia kalo yang pergi itu mafioso
            if (visitor.role.name === "godfather") {
              if (mafiaDoerIndex !== i) continue;
            }

            werewolfRampageTargetIndexes.push(i);
          }
        }

        // Werewolf Killing Action
        for (let u = 0; u < werewolfRampageTargetIndexes.length; u++) {
          let targetIndex = werewolfRampageTargetIndexes[u];
          let targetRoleName = players[targetIndex].role.name;

          this.group_session.players[i].message +=
            "💡 Kamu menyerang seseorang!" + "\n\n";

          if (players[targetIndex].bugged) {
            spyBuggedInfo[targetIndex] +=
              "🔍 Target kamu di serang Werewolf!" + "\n\n";
          }

          this.group_session.players[targetIndex].message +=
            "🐺 Kamu diserang " + roleName + "!" + "\n\n";

          this.group_session.players[targetIndex].attacked = true;

          let attacker = {
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
      let doer = players[i];

      if (doer.status === "alive" && doer.target.index !== -1) {
        if (parseInt(doer.target.index) !== parseInt(i)) {
          let targetIndex = doer.target.index;
          let target = players[targetIndex];

          if (doer.role.name === "jester") {
            continue;
          }

          if (doer.blocked) {
            continue;
          }

          // hax untuk Mafia yang tukang bunuh bukan godfather, tapi mafioso
          if (target.role.name === "veteran") {
            if (doer.role.name === "godfather") {
              if (mafiaDoerIndex !== i) {
                continue;
              }
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
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          break;
        } else {
          let targetIndexes = veteranTargetIndexes;

          this.group_session.players[i].role.alert--;

          for (let u = 0; u < targetIndexes.length; u++) {
            let targetIndex = targetIndexes[u].index;
            let target = players[targetIndex];
            let targetRoleName = target.role.name;
            let isVisitor = targetIndexes[u].isVisitor;

            if (isVisitor) {
              this.group_session.players[i].message +=
                "💡 Ada yang datang mengunjungi kamu!" + "\n\n";

              // hax karna escort dan consort sudah masukkin data visitor ke veteran
              // jadi escort dan consort tak perlu masukin lagi
              if (targetRoleName !== "escort" || targetRoleName !== "consort") {
                this.group_session.players[targetIndex].message +=
                  "👣 Kamu ke rumah " + doer.name + "\n\n";

                let visitor = {
                  name: target.name,
                  role: target.role
                };
                this.group_session.players[i].visitors.push(visitor);
              }
            }

            if (players[targetIndex].bugged) {
              spyBuggedInfo[targetIndex] +=
                "🔍 Target kamu di serang Veteran yang dia kunjungi!" + "\n\n";
            }

            this.group_session.players[targetIndex].message +=
              "💥 Kamu diserang " + roleName + " yang kamu kunjungi!" + "\n\n";

            this.group_session.players[targetIndex].attacked = true;

            let attacker = {
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

    /// Arsonist Douse Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];
      let roleName = doer.role.name;
      let status = doer.status;
      let targetIndex = doer.target.index;

      if (roleName === "arsonist" && status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else if (parseInt(targetIndex) !== parseInt(i)) {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else if (!doer.attacked) {
            let target = players[targetIndex];

            this.group_session.players[targetIndex].doused = true;

            if (players[targetIndex].bugged) {
              spyBuggedInfo[targetIndex] +=
                "🔍 Target kamu disiram bensin oleh Arsonist!" + "\n\n";
            }

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            let visitor = {
              name: doer.name,
              role: doer.role
            };
            this.group_session.players[targetIndex].visitors.push(visitor);

            this.group_session.players[i].message +=
              "⛽ Kamu diam diam menyiram bensin ke rumah " +
              target.name +
              "\n\n";
          }
        }
      }
    }

    /// Jester Haunt Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];
      let roleName = doer.role.name;

      if (doer.role.name === "jester") {
        if (doer.role.isLynched && !doer.role.hasRevenged) {
          let targetIndex = -1;

          if (doer.target.index === -1) {
            // random kill
            this.group_session.players[i].message +=
              "💡 Karena kamu tidak pilih target, kamu akan sembarangan menghantui orang" +
              "\n\n";

            targetIndex = this.getJesterTargetIndex(doer.id);
          } else {
            targetIndex = doer.target.index;
          }

          this.group_session.players[targetIndex].message +=
            "👻 SURPRISEEE!! Kamu didatangi 🃏 Jester yang mati itu" + "\n\n";

          if (players[targetIndex].bugged) {
            spyBuggedInfo[targetIndex] +=
              "🔍 Target kamu di hantui Jester!" + "\n\n";
          }

          this.group_session.players[targetIndex].attacked = true;
          this.group_session.players[targetIndex].isHaunted = true;

          let attacker = {
            index: i,
            name: doer.name,
            role: doer.role,
            deathNote: doer.deathNote,
            countered: false
          };

          this.group_session.players[targetIndex].attackers.push(attacker);

          this.group_session.players[i].role.hasRevenged = true;

          this.group_session.players[i].message +=
            "👻 Kamu menghantui " +
            players[targetIndex].name +
            " sampai dia mati ketakutan" +
            "\n\n";
        }
      }
    }

    /// Retributionist Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "retributionist" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            let visitor = {
              name: doer.name,
              role: doer.role
            };
            this.group_session.players[targetIndex].visitors.push(visitor);

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
              "⚰️ Kamu berhasil membangkitkan " +
              target.name +
              " (" +
              targetRoleName +
              ")" +
              "\n\n";

            this.group_session.players[targetIndex].message +=
              "⚰️ Kamu berhasil dibangkitkan Retributionist!" + "\n\n";

            allAnnouncement += `⚰️ ${target.name} (${targetRoleName}) bangkit dari kematian!\n\n`;
          }
        }
      }
    }

    /// Doctor Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "doctor" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];
            let targetName = target.name;

            if (parseInt(targetIndex) === parseInt(i)) {
              targetName = "diri sendiri";

              this.group_session.players[i].message +=
                "🏠 Kamu memilih diam di rumah dan jaga-jaga" + "\n\n";

              this.group_session.players[i].role.selfHeal--;

              this.group_session.players[i].selfHeal = true;
            } else {
              let visitor = {
                name: doer.name,
                role: doer.role
              };

              this.group_session.players[targetIndex].visitors.push(visitor);

              this.group_session.players[i].message +=
                "👣 Kamu ke rumah " + target.name + "\n\n";

              this.group_session.players[targetIndex].healed = true;

              let protector = {
                index: i,
                roleName: doer.role.name,
                used: false
              };

              this.group_session.players[targetIndex].protectors.push(
                protector
              );
            }
          }
        }
      }
    }

    /// Bodyguard Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "bodyguard" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];
            let targetName = target.name;

            if (parseInt(targetIndex) === parseInt(i)) {
              targetName = "diri sendiri";

              this.group_session.players[i].message +=
                "🦺 Kamu memilih diam di rumah dan menggunakan vest" + "\n\n";

              this.group_session.players[i].role.vest--;
              this.group_session.players[i].vested = true;
            } else {
              let visitor = {
                name: doer.name,
                role: doer.role
              };

              this.group_session.players[targetIndex].visitors.push(visitor);

              this.group_session.players[i].message +=
                "👣 Kamu ke rumah " + target.name + "\n\n";

              this.group_session.players[targetIndex].guarded = true;

              let protector = {
                index: i,
                roleName: doer.role.name,
                used: false
              };

              this.group_session.players[targetIndex].protectors.push(
                protector
              );
            }
          }
        }
      }
    }

    /// Survivor Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];
      let roleName = doer.role.name;
      let status = doer.status;
      let isUseSkill = false;
      if (doer.target.index !== -1) {
        isUseSkill = true;
      }

      if (roleName === "survivor" && status === "alive") {
        if (doer.blocked === true) {
          this.group_session.players[i].message +=
            "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
            "\n\n";

          continue;
        }

        if (!isUseSkill) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";
        } else {
          this.group_session.players[i].role.vest--;
          this.group_session.players[i].vested = true;
        }
      }
    }

    /// Vampire hunter Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "vampire-hunter" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else if (!doer.attacked) {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            if (doer.intercepted) {
              this.group_session.players[i].message +=
                "💡 Kamu tercegat oleh " + target.role.name + "\n\n";
            } else {
              this.group_session.players[i].message +=
                "👣 Kamu ke rumah " + target.name + "\n\n";

              let visitor = {
                name: doer.name,
                role: doer.role
              };
              this.group_session.players[targetIndex].visitors.push(visitor);
            }

            if (target.role.team === "vampire") {
              this.group_session.players[i].message +=
                "🗡️ " + target.name + " adalah seorang Vampire!" + "\n\n";

              this.group_session.players[targetIndex].message +=
                "🗡️ Kamu diserang " + doer.role.name + "!" + "\n\n";

              if (doer.intercepted) {
                if (players[targetIndex].bugged) {
                  spyBuggedInfo[targetIndex] +=
                    "🔍 Target kamu di serang Vampire Hunter yang dia kunjungi!" +
                    "\n\n";
                }
              } else {
                if (players[targetIndex].bugged) {
                  spyBuggedInfo[targetIndex] +=
                    "🔍 Target kamu di serang Vampire Hunter!" + "\n\n";
                }
              }

              this.group_session.players[targetIndex].attacked = true;

              let attacker = {
                index: i,
                name: doer.name,
                role: doer.role,
                deathNote: doer.deathNote,
                countered: false
              };

              this.group_session.players[targetIndex].attackers.push(attacker);
            } else {
              this.group_session.players[i].message +=
                "💡 " + target.name + " bukan seorang Vampire" + "\n\n";
            }
          }
        }
      }
    }

    /// Vigilante Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "vigilante" && doer.status === "alive") {
        if (doer.willSuicide) {
          continue;
        }

        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else if (!doer.attacked) {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            this.group_session.players[i].role.bullet--;

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            let visitor = {
              name: doer.name,
              role: doer.role
            };
            this.group_session.players[targetIndex].visitors.push(visitor);

            let immuneToBasicAttack = [
              "serial-killer",
              "arsonist",
              "godfather",
              "executioner"
            ];

            if (this.group_session.isFullMoon) {
              immuneToBasicAttack.push("werewolf");
            }

            if (immuneToBasicAttack.includes(target.role.name)) {
              this.group_session.players[i].message +=
                "💡 Target kamu immune dari serangan!" + "\n\n";
              this.group_session.players[targetIndex].message +=
                "💡 Ada yang menyerang kamu tapi kamu immune dari serangan!" +
                "\n\n";

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] +=
                  "🔍 Target kamu di serang tapi serangan tersebut tidak mempan!" +
                  "\n\n";
              }
            } else {
              this.group_session.players[i].message +=
                "💡 Kamu menyerang " + target.name + "\n\n";

              this.group_session.players[targetIndex].message +=
                "🔫 Kamu diserang " + doer.role.name + "!" + "\n\n";

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] +=
                  "🔍 Target kamu di serang Vigilante!" + "\n\n";
              }

              this.group_session.players[targetIndex].attacked = true;

              let attacker = {
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

    /// Serial Killer Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "serial-killer" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (!doer.attacked) {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            if (doer.intercepted) {
              this.group_session.players[i].message +=
                "💡 Kamu tercegat oleh " + target.name + "\n\n";
            } else {
              this.group_session.players[i].message +=
                "👣 Kamu ke rumah " + target.name + "\n\n";

              let visitor = {
                name: doer.name,
                role: doer.role
              };
              this.group_session.players[targetIndex].visitors.push(visitor);
            }

            let immuneToBasicAttack = [
              "serial-killer",
              "arsonist",
              "godfather",
              "executioner"
            ];

            if (immuneToBasicAttack.includes(target.role.name)) {
              this.group_session.players[i].message +=
                "💡 Target kamu immune dari serangan!" + "\n\n";
              this.group_session.players[targetIndex].message +=
                "💡 Ada yang menyerang kamu tapi kamu immune dari serangan!" +
                "\n\n";

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] +=
                  "🔍 Target kamu diserang tapi serangan tersebut tidak mempan!" +
                  "\n\n";
              }
            } else {
              this.group_session.players[i].message +=
                "💡 Kamu menyerang " + target.name + "\n\n";

              if (doer.intercepted) {
                this.group_session.players[targetIndex].message +=
                  "🔪 Kamu diserang " +
                  doer.role.name +
                  " yang kamu kunjungi!" +
                  "\n\n";

                if (players[targetIndex].bugged) {
                  spyBuggedInfo[targetIndex] +=
                    "🔍 Target kamu di serang Serial Killer yang dia kunjungi!" +
                    "\n\n";
                }

                if (players[i].bugged) {
                  spyBuggedInfo[targetIndex] +=
                    "🔍 Ada yang berusaha role block Targetmu, tetapi Targetmu menyerang balik!" +
                    "\n\n";
                }
              } else {
                this.group_session.players[targetIndex].message +=
                  "🔪 Kamu diserang " + doer.role.name + "!" + "\n\n";

                if (players[targetIndex].bugged) {
                  spyBuggedInfo[targetIndex] +=
                    "🔍 Target kamu di serang Serial Killer!" + "\n\n";
                }
              }

              this.group_session.players[targetIndex].attacked = true;

              let attacker = {
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

    /// Arsonist Ignite Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];
      let roleName = doer.role.name;
      let status = doer.status;
      let targetIndex = doer.target.index;

      if (roleName === "arsonist" && status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else if (parseInt(targetIndex) === parseInt(i)) {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else if (!doer.attacked) {
            let targetIndexes = players.map((p, idx) => {
              if (p.doused && p.status === "alive") {
                return idx;
              }
            });

            for (let u = 0; u < targetIndexes.length; u++) {
              let targetIndex = targetIndexes[u];

              if (targetIndex === undefined) {
                continue;
              }

              let target = players[targetIndex];

              this.group_session.players[i].message +=
                "💡 Kamu bakar rumah " + target.name + "\n\n";

              this.group_session.players[targetIndex].message +=
                "🔥 Rumah kamu dibakar " + doer.role.name + "!" + "\n\n";

              if (players[targetIndex].bugged) {
                spyBuggedInfo[targetIndex] +=
                  "🔍 Target kamu di bakar Arsonist!" + "\n\n";
              }

              this.group_session.players[targetIndex].burned = true;

              this.group_session.players[targetIndex].attacked = true;

              let attacker = {
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

    /// Mafia Killing Action
    if (isMainMafiaUseSkill || isBackupMafiaUseSkill) {
      let wasMafiaDoer = players[mafiaDoerIndex];
      if (wasMafiaDoer.attacked) {
        let pastTargetIndex = wasMafiaDoer.target.index;
        let pastTarget = players[pastTargetIndex];

        if (pastTarget && pastTarget.role.name !== "veteran") {
          if (isBackupMafiaUseSkill && mafiaDoerBackupIndex !== -1) {
            mafiaDoerIndex = mafiaDoerBackupIndex;
            this.group_session.players[
              mafiaDoerIndex
            ].target.index = pastTargetIndex;
          }
        }
      }

      for (let i = 0; i < players.length; i++) {
        if (mafiaDoerIndex === i) {
          let doer = players[i];
          let status = doer.status;
          let targetIndex = doer.target.index;

          if (status === "alive" && targetIndex !== -1) {
            if (doer.blocked === true) {
              this.group_session.players[i].message +=
                "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
                "\n\n";

              break;
            } else if (!doer.attacked) {
              let target = players[targetIndex];

              let visitor = {
                name: doer.name,
                role: doer.role
              };
              this.group_session.players[targetIndex].visitors.push(visitor);

              if (doer.role.name === "godfather") {
                this.group_session.players[i].message +=
                  "👣 Kamu ke rumah " + target.name + "\n\n";
              } else {
                this.group_session.players[i].message +=
                  "👣 Kamu disuruh ke rumah " + target.name + "\n\n";
              }

              mafiaAnnouncement += `👣 ${doer.name} mengunjungi rumah ${target.name}\n\n`;

              let immuneToBasicAttack = [
                "serial-killer",
                "arsonist",
                "executioner"
              ];

              if (this.group_session.isFullMoon) {
                immuneToBasicAttack.push("werewolf");
              }

              spyMafiaVisitInfo += `🤵 ${target.name} dikunjungi anggota Mafia\n\n`;

              if (immuneToBasicAttack.includes(target.role.name)) {
                this.group_session.players[i].message +=
                  "💡 Target kamu immune dari serangan!" + "\n\n";
                this.group_session.players[targetIndex].message +=
                  "💡 Ada yang menyerang kamu tapi kamu immune dari serangan!" +
                  "\n\n";

                if (players[targetIndex].bugged) {
                  spyBuggedInfo[targetIndex] +=
                    "🔍 Target kamu di serang tapi serangan tersebut tidak mempan!" +
                    "\n\n";
                }
              } else {
                this.group_session.players[i].message +=
                  "💡 Kamu menyerang " + target.name + "\n\n";

                this.group_session.players[targetIndex].message +=
                  "🤵 Kamu diserang " + doer.role.team + "!" + "\n\n";

                this.group_session.players[targetIndex].attacked = true;

                if (players[targetIndex].bugged) {
                  spyBuggedInfo[targetIndex] +=
                    "🔍 Target kamu di serang Mafia!" + "\n\n";
                }

                let attacker = {
                  index: i,
                  name: doer.name,
                  role: doer.role,
                  deathNote: doer.deathNote,
                  countered: false
                };

                this.group_session.players[targetIndex].attackers.push(
                  attacker
                );
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
        let isAttacked = players[i].attacked;
        let isVampireBited = players[i].vampireBited;

        let isHealed = players[i].healed;
        let isVested = players[i].vested;
        let isGuarded = players[i].guarded;
        let isSelfHeal = players[i].selfHeal;

        let isBurned = players[i].burned;
        let isHaunted = players[i].isHaunted;
        let willSuicide = players[i].willSuicide;
        let afkCounter = players[i].afkCounter;

        let attackers = players[i].attackers;
        let protectors = players[i].protectors;

        let vestUsed = false;
        let selfHealUsed = false;

        if (isAttacked || isVampireBited) {
          this.group_session.players[i].damage = attackers.length;

          if (!isBurned && !isHaunted && !willSuicide && afkCounter < 6) {
            for (let x = 0; x < attackers.length; x++) {
              let attacker = attackers[x];

              if (isHealed || isGuarded) {
                for (let u = 0; u < protectors.length; u++) {
                  let protector = protectors[u];

                  this.group_session.players[protector.index].message +=
                    "💡 " + players[i].name + " diserang semalam!" + "\n\n";

                  if (attacker.countered) {
                    continue;
                  }

                  if (protector.used) {
                    continue;
                  }

                  if (protector.roleName === "bodyguard") {
                    // bodyguard tidak lindungi yang diserang veteran alert
                    if (attacker.role.name === "veteran") {
                      continue;
                    }

                    // counter attack
                    if (players[protector.index].bugged) {
                      spyBuggedInfo[protector.index] +=
                        "🔍 Target kamu sedang melindungi seseorang!" + "\n\n";
                    }

                    this.group_session.players[i].message +=
                      "🛡️ Ada yang menyerang balik penyerang mu!" + "\n\n";

                    this.group_session.players[
                      protector.index
                    ].role.counterAttackIndex = attacker.index;

                    protector.used = true;

                    attacker.countered = true;
                  }

                  if (protector.roleName === "doctor") {
                    if (players[protector.index].bugged) {
                      spyBuggedInfo[protector.index] +=
                        "🔍 Target dari Targetmu di serang!" + "\n\n";
                    }

                    this.group_session.players[i].message +=
                      "💉 Ada yang datang berusaha menyelamatkanmu!" + "\n\n";

                    protector.used = true;
                  }

                  this.group_session.players[i].damage--;
                }
              }

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
                  spyBuggedInfo[i] +=
                    "🔍 Target kamu selamat dari serangan berkat Vest yang digunakannya!" +
                    "\n\n";
                }

                this.group_session.players[i].message +=
                  "🦺 Vest yang kamu pakai menyelamatkan nyawamu!" + "\n\n";
              }

              if (isSelfHeal) {
                if (players[i].bugged) {
                  spyBuggedInfo[i] +=
                    "🔍 Target kamu selamat karena menyembuhkan diri sendiri!" +
                    "\n\n";
                }

                this.group_session.players[i].message +=
                  "💉 Kamu selamat dengan menyembuhkan diri sendiri!" + "\n\n";
              }

              if (isGuarded) {
                if (players[i].bugged) {
                  spyBuggedInfo[i] +=
                    "🔍 Target kamu selamat karena dilindungi seseorang!" +
                    "\n\n";
                }
              }

              if (isHealed) {
                if (players[i].bugged) {
                  spyBuggedInfo[i] +=
                    "🔍 Target kamu selamat karena disembuhkan!" + "\n\n";
                }
              }

              continue;
            } else {
              //not enough protector or no protector

              // check vampireBited
              if (!isAttacked) continue;
            }
          }

          this.group_session.players[i].status = "will_death";
        } else if (willSuicide || afkCounter >= 6) {
          this.group_session.players[i].status = "will_death";
        }
      }
    }

    /// Bodyguard Counter Attack Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "bodyguard") {
        let attackerIndex = players[i].role.counterAttackIndex;
        let targetIndex = doer.target.index;

        if (attackerIndex !== -1) {
          let isAttackerHealed = players[attackerIndex].healed;
          let isHealed = players[i].healed;

          this.group_session.players[i].message +=
            "💡 Kamu melawan penyerang " +
            players[targetIndex].name +
            ", dan diserang penyerang tersebut!" +
            "\n\n";

          this.group_session.players[attackerIndex].message +=
            "🛡️ " +
            players[targetIndex].name +
            " dilindungi Bodyguard! " +
            "Kamu diserang Bodyguard!" +
            "\n\n";

          if (players[i].bugged) {
            spyBuggedInfo[i] +=
              "🔍 Target kamu diserang karena melindungi seseorang!" + "\n\n";
          }

          if (players[attackerIndex].bugged) {
            spyBuggedInfo[attackerIndex] +=
              "🔍 Target kamu diserang Bodyguard!" + "\n\n";
          }

          // attacker checker
          this.group_session.players[attackerIndex].damage += 1;
          if (isAttackerHealed) {
            let attackerProtectors = players[attackerIndex].protectors;
            for (let u = 0; u < attackerProtectors.length; u++) {
              let protector = attackerProtectors[u];

              if (protector.used) {
                continue;
              }

              this.group_session.players[protector.index].message +=
                "💡 " + players[i].name + " diserang semalam!" + "\n\n";

              if (protector.roleName === "doctor") {
                if (players[protector.index].bugged) {
                  spyBuggedInfo[protector.index] +=
                    "🔍 Target dari Targetmu di serang!" + "\n\n";
                }

                this.group_session.players[attackerIndex].message +=
                  "💉 Ada yang datang berusaha menyelamatkanmu!" + "\n\n";

                protector.used = true;
              }

              this.group_session.players[attackerIndex].damage--;
            }
          }

          if (this.group_session.players[attackerIndex].damage <= 0) {
            //saved
            if (isAttackerHealed) {
              if (players[attackerIndex].bugged) {
                spyBuggedInfo[attackerIndex] +=
                  "🔍 Target kamu selamat karena disembuhkan!" + "\n\n";
              }
            }
          } else {
            //not enough protector or no protector
            this.group_session.players[attackerIndex].status = "will_death";

            let attacker = {
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
                  spyBuggedInfo[protector.index] +=
                    "🔍 Target dari Targetmu di serang!" + "\n\n";
                }

                this.group_session.players[i].message +=
                  "💉 Ada yang datang berusaha menyelamatkanmu!" + "\n\n";

                protector.used = true;
              }

              this.group_session.players[i].damage--;
            }
          }

          if (this.group_session.players[i].damage <= 0) {
            //saved
            if (isHealed) {
              if (players[i].bugged) {
                spyBuggedInfo[i] +=
                  "🔍 Target kamu selamat karena disembuhkan!" + "\n\n";
              }
            }
          } else {
            //not enough protector or no protector

            this.group_session.players[i].status = "will_death";

            let attacker = {
              index: attackerIndex,
              name: players[attackerIndex].name,
              role: players[attackerIndex].role,
              deathNote: players[attackerIndex].deathNote,
              countered: false
            };

            // hax jika kenak effect rampage werewolf atau juggernaut
            // soalnya pas rampage udah ada dimasukin obj attacker
            let rampageRole = ["werewolf", "juggernaut"];

            if (!rampageRole.includes(players[attackerIndex].role.name)) {
              // check juggernaut juga
              let targetRoleName = players[attackerIndex].role.name;
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

    /// Death Action II
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

        for (let i = 0; i < attackersIndex.length; i++) {
          let attackerIndex = attackersIndex[i];
          if (players[attackerIndex].role.name === "juggernaut") {
            this.group_session.players[attackerIndex].role.skillLevel++;

            let text = "";
            let skillLevel = this.group_session.players[attackerIndex].role
              .skillLevel;
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
                text +=
                  "💪 Seranganmu sekarang bisa menembus perlindungan biasa";
                break;
            }

            this.group_session.players[attackerIndex].addonMessage = text;
          }
        }

        let isAfk = false;
        let isSuicide = false;

        if (attackersRole.length > 0) {
          //
        } else if (players[i].afkCounter >= 6) {
          isAfk = true;
        } else if (willSuicide) {
          isSuicide = true;
          if (players[i].bugged) {
            spyBuggedInfo[i] +=
              "🔍 Target kamu mati bunuh diri karena perasaan bersalah!" +
              "\n\n";
          }
        }

        attackedAnnouncement = attackedMsg.getAttackResponse(
          attackersRole,
          players[i].name,
          isSuicide,
          isAfk
        );

        allAnnouncement += attackedAnnouncement + "\n";
        allAnnouncement += "✉️ Role nya adalah " + roleName + "\n\n";

        //Thanks to
        //https://stackoverflow.com/questions/24806772/how-to-skip-over-an-element-in-map/24806827
        let attackersDeathNote = players[i].attackers
          .filter(atkr => {
            if (!atkr.deathNote) {
              return false;
            }
            return true;
          })
          .map((atkr, idx) => {
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
            header: {
              text: "📝💀 Death Note " + victimName
            },
            body: {
              text: attackersDeathNote
            }
          };

          flex_texts.push(deathFlex_text);
        }

        ///yang baru mati
        if (this.group_session.players[i].status === "death") {
          /// special check for some role
          if (this.checkExistsRole("executioner")) {
            exeIndex = this.getPlayerIndexByRole("executioner");
            let exeLynchTargetIndex = players[exeIndex].role.targetLynchIndex;
            if (i === exeLynchTargetIndex) {
              isExecutionerTargetDie = true;
            }
          }

          this.substituteMafia(this.group_session.players[i]);
        }
      }
    }

    /// Vampire convertion Action
    for (let i = 0; i < players.length; i++) {
      if (players[i].status === "alive" && players[i].willSuicide === false) {
        if (players[i].vampireBited === true && players[i].healed === false) {
          let roleData = this.getRoleData("vampire");

          this.group_session.players[i].role = roleData;

          this.group_session.players[i].message +=
            "🧛 " + "Kamu berhasil diubah menjadi Vampire" + "\n\n";

          this.group_session.players[i].message +=
            "💡 Ketik '/role' untuk mengetahui siapa saja sesama Vampire" +
            "\n\n";

          vampireAnnouncement += `🧛 ${players[i].name} berhasil menjadi Vampire!\n\n`;

          this.group_session.vampireConvertCooldown = 1;

          break;
        }
      }
    }

    /// Framer Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "framer" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            let visitor = {
              name: doer.name,
              role: doer.role
            };

            this.group_session.players[targetIndex].visitors.push(visitor);

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            this.group_session.players[i].message +=
              "🎞️ Kamu menjebak " +
              target.name +
              " agar terlihat bersalah" +
              "\n\n";

            mafiaAnnouncement += `🎞️ ${doer.name} menjebak ${target.name}\n\n`;

            spyMafiaVisitInfo += `🤵 ${target.name} dikunjungi anggota Mafia\n\n`;

            this.group_session.players[targetIndex].framed = true;
          }
        }
      }
    }

    /// Sheriff Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "sheriff" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            let visitor = {
              name: doer.name,
              role: doer.role
            };

            this.group_session.players[targetIndex].visitors.push(visitor);

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            let suspiciousList = [
              "mafioso",
              "consigliere",
              "consort",
              "serial-killer",
              "framer",
              "disguiser"
            ];

            if (this.group_session.isFullMoon) {
              suspiciousList.push("werewolf");
            }

            if (target.framed || suspiciousList.includes(target.role.name)) {
              this.group_session.players[i].message +=
                "👮 " + target.name + " mencurigakan" + "\n\n";
            } else {
              this.group_session.players[i].message +=
                "👮 Kamu tidak menemukan bukti kesalahan target. Tampaknya " +
                target.name +
                " tidak bersalah" +
                "\n\n";
            }
          }
        }
      }
    }

    /// Investigator Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "investigator" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            let visitor = {
              name: doer.name,
              role: doer.role
            };

            this.group_session.players[targetIndex].visitors.push(visitor);

            let targetRoleName = target.role.name;

            if (target.framed) {
              targetRoleName = "godfather";
            }

            if (target.role.disguiseAs) {
              targetRoleName = target.role.disguiseAs;
            }

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            let guessResult = helper.getInvestigatorResult(targetRoleName);
            
            this.group_session.players[i].message +=
              "🕵️ Role " + target.name + " adalah " + targetRoleName + "\n\n";
          }
        }
      }
    }

    /// Consigliere Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "consigliere" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            let visitor = {
              name: doer.name,
              role: doer.role
            };

            this.group_session.players[targetIndex].visitors.push(visitor);

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            mafiaAnnouncement += `✒️ Role ${target.name} adalah ${target.role.name}\n\n`;

            spyMafiaVisitInfo += `🤵 ${target.name} dikunjungi anggota Mafia\n\n`;

            this.group_session.players[i].message +=
              "💡 Kamu bisa cek info role dengan ketik '/info " +
              target.role.name +
              "'" +
              "\n\n";
          }
        }
      }
    }

    /// Spy Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "spy" && doer.status === "alive") {
        if (!doer.blocked) {
          this.group_session.players[i].message += spyMafiaVisitInfo;
        }

        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            let visitor = {
              name: doer.name,
              role: doer.role
            };

            this.group_session.players[targetIndex].visitors.push(visitor);

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            if (spyBuggedInfo[targetIndex]) {
              this.group_session.players[i].message +=
                spyBuggedInfo[targetIndex];
            } else {
              this.group_session.players[i].message +=
                "🔍 " + target.name + " tidak terkena apa apa" + "\n\n";
            }
          }
        }
      }
    }

    /// Tracker visit action
    // for lookout data
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "tracker" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            let visitor = {
              name: doer.name,
              role: doer.role
            };

            this.group_session.players[targetIndex].visitors.push(visitor);

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";
          }
        }
      }
    }

    /// Lookout Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "lookout" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];
            let targetName = target.name;

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            let visitor = {
              name: doer.name,
              role: doer.role
            };
            this.group_session.players[targetIndex].visitors.push(visitor);

            if (target.visitors.length > 1) {
              let targetVisitors = "";
              let visitors = target.visitors.map(v => {
                return v.name;
              });

              for (let i = 0; i < visitors.length; i++) {
                if (visitors[i] === doer.name) {
                  visitors.splice(i, 1);
                }
              }

              targetVisitors = visitors.join(", ");

              this.group_session.players[i].message +=
                "👀 Rumah " +
                players[targetIndex].name +
                " dikunjungi " +
                targetVisitors +
                " semalam" +
                "\n\n";
            } else {
              // pasti ada 1 visitor, yaitu lookout sndiri
              this.group_session.players[i].message +=
                "👀 Rumah " +
                players[targetIndex].name +
                " tidak didatangi siapa siapa" +
                "\n\n";
            }
          }
        }
      }
    }

    /// Tracker action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "tracker" && doer.status === "alive") {
        if (doer.target.index === -1) {
          continue;
        } else {
          if (doer.blocked === true) {
            continue;
          } else {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            let result = "";
            if (
              target.intercepted ||
              target.blocked ||
              target.target.index === -1 ||
              target.target.index === targetIndex
            ) {
              result += "👣 Targetmu diam dirumah saja" + "\n\n";
            } else {
              let targetTargetName = players[target.target.index].name;
              result += "👣 Target mu ke rumah " + targetTargetName + "\n\n";
            }

            this.group_session.players[i].message += result;
          }
        }
      }
    }

    /// Post Vigilante check the target
    if (vigilanteExists) {
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
                this.group_session.players[i].message +=
                  "💡 Kamu membunuh warga!" + "\n\n";
              }
            }
          }
        }
      }
    }

    if (isExecutionerTargetDie) {
      this.group_session.players[exeIndex].message +=
        "💡 Targetmu mati pas malam dibunuh. Kamu menjadi role Jester";

      let roleData = this.getRoleData("jester");
      this.group_session.players[exeIndex].role = roleData;
    }

    /// untuk announcement certain role
    this.group_session.players.forEach((item, index) => {
      /// Vampire Announcement
      if (item.role.team === "vampire" && item.status === "alive") {
        item.message += vampireAnnouncement;
      }

      /// Mafia Announcement
      if (item.role.team === "mafia" && item.status === "alive") {
        item.message += mafiaAnnouncement;
      }

      if (process.env.TEST === "true") {
        console.log(`pesan ${item.name} (${item.role.name}) : ${item.message}`);
      }

      if (!item.message) {
        item.message += "🛏️ Kamu tidak diganggu semalam";
      }

      /// journal , keep this below any special Announcement

      let journal = {
        nightCounter: this.group_session.nightCounter,
        content: item.message.trim()
      };
      item.journals.push(journal);
    });

    if (!allAnnouncement) {
      let peaceText = helper.random(peaceMsg);
      allAnnouncement += peaceText + "\n\n";
    }

    let flex_text = {
      header: {
        text: "⛅ Day"
      },
      body: {
        text: allAnnouncement
      }
    };

    ///check victory
    let someoneWin = this.checkVictory();

    if (someoneWin) {
      flex_texts.unshift(flex_text);
      return this.endGame(flex_texts, someoneWin);
    } else {
      let alivePlayersCount = this.getAlivePlayersCount();
      this.group_session.time_default = this.getTimeDefault(alivePlayersCount);
      this.group_session.time = this.group_session.time_default;

      let timerText =
        "💬 Warga diberi waktu diskusi selama " +
        this.group_session.time_default +
        " detik" +
        "\n";

      timerText += "💀 Siapa yang mau di" + this.group_session.punishment;

      flex_text.body.text += timerText;

      if (this.group_session.nightCounter === 1) {
        flex_text.body.text +=
          "\n\n" +
          "💡 Pengguna Skill jangan lupa gunakan commands '/news' di pc bot";
      }

      flex_text.footer = {
        buttons: [
          {
            action: "uri",
            label: "✉️ News",
            data:
              "https://line.me/R/oaMessage/" + process.env.BOT_ID + "/?%2Fnews"
          },
          {
            action: "postback",
            label: "📣 Voting!",
            data: "/check"
          }
        ]
      };

      this.runTimer();

      flex_texts.unshift(flex_text);
      return this.replyFlex(flex_texts);
    }
  },

  votingCommand: function() {
    let index = this.indexOfPlayer();
    let players = this.group_session.players;

    let text = "";
    let time = this.group_session.time;

    if (this.group_session.state === "day") {
      if (time > 0) {
        let remindText =
          "💡 " + this.user_session.name + ", belum saatnya voting" + "\n";
        remindText +=
          "⏳ Sisa waktu " + time + " detik lagi untuk voting" + "\n";
        remindText += "💡 Kesempatan check : " + this.group_session.checkChance;
        return this.replyText(remindText);
      } else {
        // ini pertama kali votingCommand dipakai
        this.group_session.state = "vote";
        this.group_session.lynched = null;

        this.runTimer();

        let default_time = this.group_session.time_default;
        text += "⏳ Waktu yang diberikan " + default_time + " detik" + "\n";
      }
    }

    let voteNeeded = Math.round(this.getAlivePlayersCount() / 2);
    let voteNeededText = "\n" + "💡 Dibutuhkan " + voteNeeded;
    voteNeededText += " vote untuk " + this.group_session.punishment + " orang";

    let flexBodyText =
      "💀 Pilih siapa yang mau di" + this.group_session.punishment + "\n";
    flexBodyText += text + voteNeededText;

    if (this.group_session.nightCounter === 1) {
      flexBodyText += "\n\n" + "💡 Untuk batal vote bisa ketik '/revoke'";
    }

    let flex_texts = [];
    let flex_text = {
      header: {
        text: "📣 Voting"
      },
      body: {
        text: flexBodyText
      },
      footer: {
        buttons: []
      }
    };

    let button = {};
    players.forEach((item, index) => {
      if (item.status === "alive") {
        button[index] = {
          action: "postback",
          label: item.name,
          data: "/vote " + index
        };

        flex_text.footer.buttons.push(button[index]);
      }
    });
    flex_texts.push(flex_text);

    let alivePlayers = this.getAlivePlayers();
    let playerListFlex = this.getTableFlex(alivePlayers, null, "📣 Voting");
    flex_texts.push(playerListFlex);

    return this.replyFlex(flex_texts);
  },

  voteCommand: function() {
    if (this.group_session.state !== "vote") {
      return Promise.resolve(null);
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;

    if (index === -1) {
      let text =
        "💡 " + this.user_session.name + ", kamu belum join kedalam game";
      return this.replyText(text);
    }

    if (players[index].status !== "alive") {
      let text = "💡 " + this.user_session.name + ", kamu sudah mati";
      return this.replyText(text);
    }

    if (!this.args[1]) {
      return this.votingCommand();
    }

    let targetIndex = this.args[1];

    if (parseInt(targetIndex) === parseInt(index)) {
      let text =
        "💡 " + this.user_session.name + ", gak bisa vote diri sendiri";
      return this.replyText(text);
    }

    if (!players[targetIndex]) {
      return this.replyText("💡 " + this.user_session.name + ", invalid vote");
    }

    let text = "☝️ " + this.user_session.name;

    if (players[index].targetVoteIndex === -1) {
      text += " vote ";
    } else if (players[index].targetVoteIndex === targetIndex) {
      text = "💡 " + this.user_session.name + ", kamu sudah vote ";
    } else {
      text += " mengganti vote ke ";
    }

    this.group_session.players[index].targetVoteIndex = targetIndex;

    text +=
      players[targetIndex].name + " untuk di" + this.group_session.punishment;

    let voteNeeded = Math.round(this.getAlivePlayersCount() / 2);

    let headerText = "📣 Voting";

    let time = this.group_session.time;

    let checkVote = this.checkVote();

    if (checkVote.status !== "enough_vote") {
      let voteFlex = "💡 Ketik '/cek' untuk munculin flex vote. ";

      if (time > 15) {
        voteFlex +=
          "⏳ Waktu tersisa " + this.group_session.time + " detik lagi";
      }

      text += "\n" + voteFlex;
      return this.replyText(text);
    } else {
      let flex_text = {
        header: {
          text: headerText
        },
        body: {
          text: text
        }
      };

      let alivePlayers = this.getAlivePlayers();
      let playerListFlex = this.getTableFlex(alivePlayers, null, headerText);
      return this.lynch([flex_text, playerListFlex]);
    }
  },

  lynch: function(flex_texts) {
    let players = this.group_session.players;
    let lynchTarget = {};
    let candidates = this.getVoteCandidates();
    lynchTarget = helper.getMostFrequent(candidates);
    let roleName = players[lynchTarget.index].role.name;

    // check if disguiser, the roleName should different
    if (players[lynchTarget.index].role.disguiseAs) {
      roleName = players[lynchTarget.index].role.disguiseAs;
    }

    this.group_session.players[lynchTarget.index].status = "death";

    let lynchedName = players[lynchTarget.index].name;
    let announcement =
      "💀 Warga memutuskan untuk " + this.group_session.punishment + " ";
    announcement +=
      lynchedName + " dengan jumlah " + lynchTarget.count + " vote";

    announcement += "\n\n" + "✉️ Role nya adalah " + roleName;

    /// Set special role trigger when lynch
    // khususnya jester dan executioner
    if (roleName === "jester") {
      this.group_session.players[lynchTarget.index].role.isLynched = true;
      this.group_session.players[lynchTarget.index].role.canKill = true;
      announcement += "\n\n" + "👻 Jester akan membalas dendam dari kuburan!";
    }

    if (this.checkExistsRole("executioner")) {
      let exeIndex = this.getPlayerIndexByRole("executioner");
      let exeLynchTargetIndex = players[exeIndex].role.targetLynchIndex;
      if (lynchTarget.index == exeLynchTargetIndex) {
        this.group_session.players[exeIndex].role.isTargetLynched = true;
      }
    }

    if (!flex_texts[0].body) {
      flex_texts[0].body = {
        text: announcement
      };
    } else {
      flex_texts[0].body.text += "\n\n" + announcement;
    }

    this.group_session.state = "lynch";
    this.group_session.lynched = players[lynchTarget.index];
    this.group_session.time = 8;
    this.resetCheckChance();

    return this.replyFlex(flex_texts);
  },

  postLynch: function() {
    let players = this.group_session.players;
    let lynched = this.group_session.lynched;

    if (!lynched) {
      return this.night(null);
    } else {
      let someoneWin = this.checkVictory();

      if (someoneWin) {
        return this.endGame(null, someoneWin);
      } else {
        this.substituteMafia(lynched);
        return this.night(null);
      }
    }
  },

  endGame: function(flex_texts, whoWin) {
    // console.log("whoWin: " + whoWin);
    /// for draw situation
    // check for remaining neutral role
    let surviveTeam = [];

    let players = this.group_session.players;
    let headerText = "";
    let newFlex_text = {
      header: {
        text: ""
      },
      footer: {
        buttons: [
          {
            action: "postback",
            label: "main lagii",
            data: "/new"
          }
        ]
      },
      table: {
        header: {
          addon: "Role"
        },
        body: []
      }
    };

    let table_body = {};

    let num = 1;
    for (let i = 0; i < players.length; i++) {
      table_body[i] = {
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
            flex: 3,
            wrap: true
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

      let roleTeam = players[i].role.team;
      let roleName = players[i].role.name;

      table_body[i].contents[0].text += num + ".";
      table_body[i].contents[1].text += players[i].name;

      // if (players[i].status === "death") {
      //   table_body[i].contents[1].text += " (💀)";
      // } else {
      //   table_body[i].contents[1].text += " (😃)";
      // }

      if (roleTeam === whoWin) {
        table_body[i].contents[2].text = "win";
      } else {
        /// check the win condition of some role
        if (roleName === "jester") {
          this.handleJesterWin(i, table_body[i].contents[2], surviveTeam);
        } else if (roleName === "survivor") {
          this.handleSurvivorWin(i, table_body[i].contents[2], surviveTeam);
        } else if (roleName === "executioner") {
          this.handleExecutionerWin(i, table_body[i].contents[2], surviveTeam);
        } else if (whoWin === "draw") {
          table_body[i].contents[2].text = "draw";
        } else {
          table_body[i].contents[2].text = "lose";
        }
      }

      // let teamEmoji = helper.getRoleTeamEmoji(roleTeam);
      table_body[i].contents[3].text += roleName;

      num++;

      newFlex_text.table.body.push(table_body[i]);
    }

    if (whoWin !== "draw") {
      let emoji = helper.getRoleTeamEmoji(whoWin) + " ";
      headerText = "🎉 " + emoji + whoWin.toUpperCase() + " win! 🎉";
    } else if (surviveTeam.length > 0) {
      let surviveTeamList = surviveTeam.join(", ");
      headerText = "🎉 " + surviveTeamList.toUpperCase() + " win! 🎉";
    } else {
      headerText = "😶 Draw Game 😶";
    }

    newFlex_text.header.text = headerText;

    this.group_session.time = 300; // reset to init time
    this.group_session.state = "idle";

    this.resetAllPlayers();

    if (!flex_texts) {
      return this.replyFlex(newFlex_text);
    } else {
      return this.replyFlex(flex_texts, null, newFlex_text);
    }
  },

  commandCommand: function() {
    let text = "";
    let cmds = [
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
      "/set : untuk setting game",
      "/tutorial : tutorial menggunakan bot ini",
      "/gamestat : status game yang berjalan di grup ini",
      "/forum : link ke openchat"
    ];

    cmds.forEach((item, index) => {
      text += "- " + item + "\n";
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

  /** helper func **/

  substituteMafia: function(checkTarget) {
    let players = this.group_session.players;
    // check mafia killing yang mati
    if (checkTarget.role.type === "Mafia Killing") {
      // check if alpha ww die, search a substitute
      if (checkTarget.role.name === "godfather") {
        this.checkMorphingRole("mafioso", "godfather", "godfather");
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
        this.checkMorphingRole("consort", "mafioso", "mafioso");
        this.checkMorphingRole("consigliere", "mafioso", "mafioso");
        this.checkMorphingRole("framer", "mafioso", "mafioso");
        this.checkMorphingRole("disguiser", "mafioso", "mafioso");
      }
    }
  },

  handleJesterWin: function(index, tableColumn, surviveTeam) {
    if (this.group_session.players[index].role.isLynched) {
      tableColumn.text = "win";
      surviveTeam.push("jester 🃏");
    } else {
      tableColumn.text = "lose";
    }
  },

  handleSurvivorWin: function(index, tableColumn, surviveTeam) {
    if (this.group_session.players[index].status === "alive") {
      tableColumn.text = "win";
      surviveTeam.push("survivor 🏳️");
    } else {
      tableColumn.text = "lose";
    }
  },

  handleExecutionerWin: function(index, tableColumn, surviveTeam) {
    if (this.group_session.players[index].role.isTargetLynched) {
      tableColumn.text = "win";
      surviveTeam.push("executioner 🪓");
    } else {
      tableColumn.text = "lose";
    }
  },

  getExecutionerTargetIndex: function(exeIndex) {
    let players = this.group_session.players;
    let maxIndex = players.length - 1;

    while (true) {
      let targetIndex = helper.getRandomInt(0, maxIndex);
      let isTownie = false;
      if (players[targetIndex].role.team === "villager") {
        isTownie = true;
      }
      if (targetIndex !== exeIndex && isTownie) {
        return targetIndex;
      }
    }
  },

  getJesterTargetIndex: function(jesterId) {
    let players = this.group_session.players;
    let maxIndex = players.length - 1;

    while (true) {
      let targetIndex = helper.getRandomInt(0, maxIndex);
      let targetId = players[targetIndex].id;
      if (targetId !== jesterId && players[targetIndex].status === "alive") {
        return targetIndex;
      }
    }
  },

  resetCheckChance: function() {
    this.group_session.checkChance = 2;
    this.group_session.deadlineCheckChance = 1;
  },

  getVoteCandidates: function() {
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
  },

  getRoleList: function() {
    let roles = this.group_session.players.map(player => {
      return player.role.type;
    });

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
    helper.shuffleArray(list);
    return list;
  },

  createNewPlayer: function(user_session) {
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
      burned: false
    };
    return newPlayer;
  },

  addPlayer: function(player) {
    this.group_session.players.push(player);
  },

  getGroupId: function() {
    let groupId = "";
    if (this.event.source.type === "group") {
      groupId = this.event.source.groupId;
    } else if (this.event.source.type === "room") {
      groupId = this.event.source.roomId;
    }
    return groupId;
  },

  checkVote: function(voteNeeded) {
    let response = {
      status: "no_candidate",
      lynchTarget: {}
    };

    let notVote = this.getNotVotePlayers();
    let players = this.group_session.players;

    if (this.group_session.time === 0 || notVote.length === 0) {
      let candidates = this.getVoteCandidates();

      let lynchTarget = helper.getMostFrequent(candidates);

      if (players[lynchTarget.index] && lynchTarget.count >= voteNeeded) {
        response.lynchTarget = lynchTarget;
        response.status = "enough_vote";
      }
    }

    return response;
  },

  getTimeDefault: function(playersLength) {
    let time = 0;

    if (playersLength === 3) {
      time = 45;
    } else if (playersLength > 10) {
      time = 100;
    } else {
      // 4 - 9 players logic
      let temp = playersLength;
      while (temp) {
        time += 0.95;
        temp--;
      }
      time = Math.round(time) * 10;
    }

    return time;
  },

  getNewStateFlex: function() {
    let infoText = "🕹️ Mode : " + this.group_session.mode;
    let flex_text = {
      header: {
        text: "🎮 Game Baru"
      },
      body: {
        text: infoText
      },
      footer: {
        buttons: [
          {
            action: "postback",
            label: "join",
            data: "/join"
          }
        ]
      }
    };
    return flex_text;
  },

  getNightStateFlex: function(text) {
    //set flex
    let flex_text = {
      header: {
        text: "🌙 Malam - " + this.group_session.nightCounter
      },
      body: {
        text: text
      },
      footer: {
        buttons: [
          {
            action: "uri",
            label: "🚪 Role",
            data:
              "https://line.me/R/oaMessage/" + process.env.BOT_ID + "/?%2Frole"
          },
          {
            action: "postback",
            label: "🔔 Check",
            data: "/check"
          }
        ]
      }
    };

    return flex_text;
  },

  getDayStateFlex: function() {
    let time = this.group_session.time;
    let timerText =
      "💬 Sisa waktu untuk warga diskusi sisa " + time + " detik lagi" + "\n";

    let flex_text = {
      header: {
        text: "☀️ Day"
      },
      body: {
        text: timerText
      },
      footer: {
        buttons: [
          {
            action: "uri",
            label: "✉️ Cek berita",
            data:
              "https://line.me/R/oaMessage/" + process.env.BOT_ID + "/?%2Fnews"
          },
          {
            action: "postback",
            label: "📣 Voting!",
            data: "/check"
          }
        ]
      }
    };
    return flex_text;
  },

  checkVictory: function() {
    let someoneWin = "";
    let players = this.group_session.players;
    let alivePeople = 0;

    // group
    let villagerCount = 0;
    let mafiaCount = 0;
    let vampireCount = 0;

    // solo
    let neutralsKilling = [
      "serial-killer",
      "arsonist",
      "werewolf",
      "juggernaut"
    ];
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
    // TODO how to make the total games still counted?
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

            if (players[i].role.team === "juggernaut") {
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
        let sortedNeutrals = neutralKillingRole.sort(
          (a, b) => b.priority - a.priority
        );
        someoneWin = sortedNeutrals[0].teamName;
      }
    }

    return someoneWin;
  },

  checkMorphingRole: function(fromMorphRole, triggerRole, toMorphRole) {
    /*
      fromMorphRole, role yang mau di cek, ini yang mau di ubah
      triggerRole, role yang jika tak ada, maka fromMoprhRole menjadi toMorphRole
      toMorphRole, role baru untuk fromMorphRole
    */
    if (this.checkExistsRole(fromMorphRole)) {
      if (!this.checkExistsRole(triggerRole)) {
        let willMorph = this.getPlayerIdByRole(fromMorphRole);
        let index = this.getPlayerIndexById(willMorph);

        let roleData = this.getRoleData(toMorphRole);

        this.group_session.players[index].role = roleData;

        /// special role morphing

        // from vampire-hunter to vigilante
        if (this.group_session.players[index].role.name === "vigilante") {
          this.group_session.players[index].role.bullet = 1;
          this.group_session.players[index].role.isLoadBullet = false;
        }

        this.group_session.players[index].addonMessage +=
          "💡 Role kamu menjadi " +
          toMorphRole +
          " karena sudah tidak ada " +
          triggerRole;
      }
    }
  },

  getNamesByTeam: function(teamName) {
    let names = [];
    this.group_session.players.forEach((item, index) => {
      if (item.role.team === teamName) {
        names.push(item.name);
      }
    });
    return names.join(", ");
  },

  getRoleData: function(roleName) {
    const roles = require("/app/roles/rolesData");
    for (let i = 0; i < roles.length; i++) {
      if (roleName === roles[i].name) {
        let roleData = JSON.parse(JSON.stringify(roles[i]));
        return roleData;
      }
    }
  },

  getTableFlex: function(alivePlayers, text, headerText, opt_buttons) {
    let players = this.group_session.players;
    let flex_text = {
      header: {
        text: headerText
      }
    };

    if (text) {
      flex_text.body = {
        text: text + "\n"
      };
    }

    if (opt_buttons) {
      flex_text.footer = {
        buttons: []
      };
      opt_buttons.forEach((item, index) => {
        flex_text.footer.buttons.push(item);
      });
    }

    flex_text.table = {
      header: {
        addon: "Vote"
      },
      body: []
    };

    let table_body = {};

    let num = 1;
    alivePlayers.forEach((voter, index) => {
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
            flex: 2
          },
          {
            type: "text",
            text: "",
            flex: 2,
            align: "center"
          }
        ],
        margin: "sm"
      };

      table_body[index].contents[0].text += num + ".";
      table_body[index].contents[1].text += voter.name;

      if (voter.targetVoteIndex === -1) {
        table_body[index].contents[2].text += "pending";
        table_body[index].contents[3].text += "-";
      } else {
        table_body[index].contents[2].text += "done";
        table_body[index].contents[3].text +=
          players[voter.targetVoteIndex].name;
      }

      num++;

      flex_text.table.body.push(table_body[index]);
    });

    return flex_text;
  },

  getNotVotePlayers: function() {
    let notVote = [];
    this.group_session.players.forEach(item => {
      if (item.status === "alive" && item.targetVoteIndex === -1) {
        notVote.push(item);
      }
    });
    return notVote;
  },

  getAlivePlayers: function() {
    let alivePlayers = [];
    this.group_session.players.forEach(item => {
      if (item.status === "alive") {
        alivePlayers.push(item);
      }
    });
    return alivePlayers;
  },

  getAlivePlayersCount: function() {
    let count = 0;
    this.group_session.players.forEach(item => {
      if (item.status === "alive") {
        count++;
      }
    });
    return count;
  },

  checkExistsRole: function(roleName) {
    let players = this.group_session.players;
    let found = false;
    for (let i = 0; i < players.length; i++) {
      if (players[i].role.name === roleName && players[i].status === "alive") {
        found = true;
        return found;
      }
    }
    return found;
  },

  getPlayerIdByRole: function(roleName) {
    for (let i = 0; i < this.group_session.players.length; i++) {
      if (this.group_session.players[i].role.name === roleName) {
        return this.group_session.players[i].id;
      }
    }
  },

  getPlayerIndexById: function(id) {
    let targetIndex = -1;
    for (let i = 0; i < this.group_session.players.length; i++) {
      if (id === this.group_session.players[i].id) {
        targetIndex = i;
        return targetIndex;
      }
    }
    return targetIndex;
  },

  getPlayerIndexByRole: function(roleName) {
    let targetIndex = -1;
    let players = this.group_session.players;
    for (let i = 0; i < players.length; i++) {
      if (roleName === players[i].role.name && players[i].status === "alive") {
        targetIndex = i;
        return targetIndex;
      }
    }
    return targetIndex;
  },

  indexOfPlayer: function() {
    let found = -1;
    for (let i = 0; i < this.group_session.players.length; i++) {
      if (this.group_session.players[i].id === this.user_session.id) {
        found = i;
        return found;
      }
    }
    return found;
  },

  runTimer: function() {
    /// set time default
    this.group_session.time = this.group_session.time_default;
    //this.group_session.time = 20;

    this.resetCheckChance();
  },

  /** message func **/

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

    let state = this.group_session.state;
    let time = this.group_session.time;
    let sender = {
      name: "",
      iconUrl: ""
    };

    if (state !== "idle" && state !== "new") {
      sender.name = "Moderator";
      sender.iconUrl =
        "https://cdn.glitch.com/fc7de31a-faeb-4c50-8a38-834ec153f590%2F%E2%80%94Pngtree%E2%80%94microphone%20vector%20icon_3725450.png?v=1587456628843";

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

        let reminder_text = {
          type: "text",
          text: reminder
        };

        opt_texts.push(reminder_text);
      }
    } else {
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
    }

    const flex = require("/app/message/flex");
    return flex.receive(
      this.client,
      this.event,
      flex_texts,
      opt_texts,
      newFlex_texts,
      null,
      sender
    );
  },

  replyText: function(texts = []) {
    let state = this.group_session.state;
    texts = Array.isArray(texts) ? texts : [texts];

    let sender = {
      name: "",
      iconUrl: ""
    };

    if (state !== "idle" && state !== "new") {
      sender.name = "Moderator";
      sender.iconUrl =
        "https://cdn.glitch.com/fc7de31a-faeb-4c50-8a38-834ec153f590%2F%E2%80%94Pngtree%E2%80%94microphone%20vector%20icon_3725450.png?v=1587456628843";
    } else {
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
    }

    let msg = texts.map(text => {
      return {
        sender: sender,
        type: "text",
        text: text.trim()
      };
    });

    return this.client.replyMessage(this.event.replyToken, msg).catch(err => {
      console.log(
        "err di replyText di main.js",
        err.originalError.response.data
      );
    });
  },

  /** save data func **/

  resetUser: function() {
    const data = require("/app/src/data");
    data.resetUser(this.user_session.id);
  },

  resetAllPlayers: function() {
    const data = require("/app/src/data");
    data.resetAllPlayers(
      this.group_session.players,
      this.group_session.groupId
    );
  }
};
