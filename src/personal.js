const skillText = require("/app/message/skill");
const flex = require("/app/message/flex");
const helper = require("/app/helper");
const rolesData = require("/app/roles/rolesData");

module.exports = {
  receive: function (client, event, args, rawArgs, user_session, group_session) {
    this.client = client;
    this.event = event;
    this.args = args;
    this.rawArgs = rawArgs;
    this.user_session = user_session;
    this.group_session = group_session;

    if (!this.rawArgs.startsWith("/")) {
      let time = this.group_session.time;
      let state = this.group_session.state;

      if (state !== "idle" && state !== "new") {
        if (time < 15) {
          let reminder = "💡 Waktu tersisa " + time + " detik lagi";
          return this.replyText(reminder);
        }
      }
      return Promise.resolve(null);
    }

    let input = this.args[0].toLowerCase();
    switch (input) {
      case "/role":
        return this.roleCommand();
      case "/announce":
      case "/news":
        return this.announceCommand();
      case "/help":
        return this.helpCommand();
      case "/cmd":
        return this.commandCommand();
      case "/info":
        return this.infoCommand();
      case "/skill":
        return this.targetCommand();
      case "/revoke":
        return this.revokeCommand();
      case "/alert":
        return this.alertCommand();
      case "/vest":
        return this.vestCommand();
      case "/protect":
        return this.protectCommand();
      case "/status":
        return this.statCommand();
      case "/dnote":
      case "/dn":
        return this.deathNoteCommand();
      case "/journal":
      case "/jurnal":
        return this.journalCommand();
      case "/r":
      case "/refresh":
        return this.refreshCommand();
      case "/c":
      case "/chat":
        return this.chatCommand();
      case "/cancel":
        return this.cancelCommand();
      case "/roles":
        return this.roleListCommand();
      default:
        return this.invalidCommand();
    }
  },

  roleListCommand: function () {
    if (this.group_session.state === "new") {
      return this.replyText("💡 Game belum dimulai");
    }

    if (!this.group_session.isShowRole) {
      let text = "💡 Tidak dapat melihat role list ";
      text += "karena settingan show role pada group di non-aktifkan!";
      return this.replyText(text);
    }

    let roles = this.group_session.roles;
    let flex_text = {
      header: {
        text: "🐺 Role List 🔮"
      },
      body: {
        text: roles.join(", ")
      }
    };
    return this.replyFlex(flex_text);
  },

  cancelCommand: function () {
    if (this.group_session.state !== "new") {
      return this.replyText("💡 Game sedang berjalan. ");
    }

    let index = this.indexOfPlayer();

    helper.cutFromArray(this.group_session.players, index);

    let text = "💡 Kamu telah meninggalkan game. ";

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

    const data = require("/app/src/data");
    data.resetUser(this.user_session.id);

    return this.replyText(text);
  },

  statCommand: function () {
    const stats = require("/app/src/stats");
    stats.receive(this.client, this.event, this.args);
  },

  notIdleCommand: function () {
    let text = "";

    if (this.group_session.state === "new") {
      text +=
        "💡 Perintah " +
        this.args[0] +
        " tidak bisa dilakukan, keluar dari room game ";
      text += "untuk melakukan perintah";
    } else {
      text +=
        "💡 Perintah " +
        this.args[0] +
        " tidak bisa dilakukan, tunggu game yang berjalan selesai";
    }

    return this.replyText(text);
  },

  revokeCommand: function () {
    let state = this.group_session.state;
    if (state === "new") {
      return this.replyText("💡 Game belum dimulai");
    }

    let index = this.indexOfPlayer();

    let players = this.group_session.players;

    if (players[index].status !== "alive") {
      return this.replyText(
        "💡 " + this.user_session.name + ", kamu sudah mati"
      );
    }

    if (players[index].target.index === -1) {
      return this.replyText("💡 Kamu belum menggunakan skill");
    }

    this.group_session.players[index].target.index = -1;

    return this.replyText("💡 Kamu batal menggunakan skill");
  },

  deathNoteCommand: function () {
    if (this.group_session.state === "new") {
      return this.replyText("💡 Game belum dimulai");
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;

    if (players[index].status === "death") {
      return this.replyText("💡 Kamu sudah mati");
    }

    if (!players[index].role.canKill) {
      return this.replyText("💡 Kamu gak bisa bunuh-bunuh di role ini");
    }

    if (this.args.length < 2) {
      return this.replyText("💡 isi death note dengan '/dnote pesan kamu'");
    }

    if (this.args.length > 60) {
      return this.replyText("💡 Death notenya kepanjangan! Max 60 kata");
    }

    let deathNote = helper.parseToText(this.args);
    let text = "";

    this.group_session.players[index].deathNote = deathNote;

    text += "💡 Kamu berhasil membuat 📝 Death Note dengan isi : " + "\n\n";
    text += "'" + deathNote + "'";

    return this.replyText(text);
  },

  targetCommand: function () {
    if (this.group_session.state === "new") {
      return this.replyText("💡 Game belum dimulai");
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;
    let state = this.group_session.state;

    if (state === "day") {
      return this.replyText("💡 Bukan saatnya menggunakan skill");
    }

    let roleName = players[index].role.name;
    let roleTeam = players[index].role.team;

    let prohibited = [
      "villager",
      "veteran",
      "survivor",
      "executioner",
      "psychic"
    ];

    if (prohibited.includes(roleName)) {
      return this.replyText("💡 Jangan pernah kau coba untuk");
    }

    /// special role yg bisa skill pas mati
    if (players[index].status === "death") {
      // Jester
      if (roleName !== "jester") {
        return this.replyText("💡 Kamu sudah mati");
      } else {
        if (!players[index].role.isLynched) {
          return this.replyText(
            "💡 Kamu hanya bisa hantui orang jika mati digantung"
          );
        } else if (players[index].role.hasRevenged) {
          return this.replyText("💡 Kamu sudah balas dendam mu kepada warga");
        }
      }
    }

    /// khusus role yang ada limited skill pas full moon
    if (!this.group_session.isFullMoon) {
      if (roleName === "werewolf") {
        return this.replyText(
          "💡 Kamu hanya bisa berubah menjadi Werewolf pada bulan purnama"
        );
      } else if (roleName === "juggernaut") {
        if (players[index].role.skillLevel === 0) {
          return this.replyText(
            "💡 Kamu hanya bisa menyerang pada bulan purnama"
          );
        }
      }
    }

    if (players[index].willSuicide) {
      return this.replyText(
        "💡 Kamu sudah tak ada semangat menggunakan skill lagi"
      );
    }

    let targetIndex = this.args[1];

    if (targetIndex === undefined) {
      return this.roleCommand();
    }

    /// special role with private prop for death
    if (roleName === "retributionist") {
      if (players[index].role.revive === 0) {
        return this.replyText(
          "💡 Kamu hanya bisa bangkitkan orang mati 1 kali"
        );
      }

      if (players[targetIndex].status === "alive") {
        return this.replyText("💡 Targetmu masih hidup");
      }

      if (players[targetIndex].role.team !== "villager") {
        return this.replyText("💡 Kamu hanya bisa bangkitin sesama warga");
      }

    } else if (roleName === "amnesiac") {
      if (players[targetIndex].status === "alive") {
        let text = "💡 Kamu hanya bisa mengingat pemain yang telah mati";
        return this.replyText(text);
      }
    } else {
      if (players[targetIndex].status === "death") {
        return this.replyText("💡 Targetmu itu dah mati. Mau di apain?");
      }
    }

    /// special role checker
    if (roleName === "vigilante") {
      if (players[index].role.bullet === 0) {
        return this.replyText(
          "💡 Kamu sudah tidak memiliki peluru yang tersisa"
        );
      }
    } else if (roleName === "arsonist") {
      if (players[targetIndex].doused) {
        return this.replyText("💡 Target yang kamu pilih sudah disirami bensin!");
      }
    } else if (roleName === "plaguebearer") {
      let isInfected = players[targetIndex].infected;
      let isPestilence = players[index].role.isPestilence;
      if (!isPestilence && isInfected) {
        return this.replyText("💡 Target yang kamu pilih sudah terinfeksi!");
      }
    }

    if (parseInt(targetIndex) === parseInt(index)) {
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
          return this.replyText(
            "💡 Kamu belum bisa bakar-bakar, karena belum menyiram bensin ke siapa-siapa. "
          );
        }
      }

      /// role yg limited to self target
      if (roleName === "doctor") {
        if (!players[index].role.selfHeal) {
          return this.replyText(
            "💡 Kamu sudah tidak bisa melindungi diri sendiri"
          );
        }
      } else if (roleName === "bodyguard") {
        if (!players[index].role.vest) {
          return this.replyText(
            "💡 Kamu sudah tidak memiliki Vest yang tersisa"
          );
        }
      }

      if (!this.canSelfTarget(roleName)) {
        return this.replyText(
          "💡 Kamu tidak bisa pilih diri sendiri di role ini"
        );
      }
    }

    // hax untuk doctor yang mau heal mayor
    if (roleName === "doctor") {
      let targetRoleName = players[targetIndex].role.name;
      if (targetRoleName === "mayor" && players[targetIndex].role.revealed) {
        return this.replyText("💡 Kamu tidak bisa heal Mayor!");
      }
    }

    if (roleName === "vampire") {
      let vampireConvertCooldown = this.group_session.vampireConvertCooldown;
      if (vampireConvertCooldown > 0) {
        let infoText = "💡 Kamu harus menunggu ";
        infoText += vampireConvertCooldown + " malam lagi untuk gigit orang";
        return this.replyText(infoText);
      }
    }

    if (roleName === "jester") {
      if (!players[index].role.isLynched || players[index].role.hasRevenged) {
        return this.replyText("💡 Jangan pernah kau coba untuk");
      }
    }

    //need system for it
    if (roleTeam === "vampire" || roleTeam === "mafia") {
      if (players[targetIndex].role.team === roleTeam) {
        return this.replyText(
          "💡 Target yang kamu pilih adalah sesama team " + roleTeam
        );
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

    this.group_session.players[index].target = {
      index: targetIndex,
      value: 1
    };

    if (roleName === "godfather") {
      this.group_session.players[index].target.value++;
    }

    /// Special role communication
    if (roleTeam === "mafia" || roleTeam === "vampire") {
      let chatBox = [];
      let text = skillText.response(doer, true);
      let message = {
        name: players[index].name,
        text: text
      };

      if (roleTeam === "mafia") {
        chatBox = this.group_session.mafiaChat;
        this.group_session.mafiaChat.push(message);
      } else if (roleTeam === "vampire") {
        chatBox = this.group_session.vampireChat;
        this.group_session.vampireChat.push(message);
      }
    }

    let text = skillText.response(doer, null);
    let msg = [text];
    if (players[index].role.canKill && players[index].deathNote === "") {
      msg.push("💡 Kamu belum buat death note, ketik '/dnote isi note kamu'");
    }

    return this.replyText(msg);
  },

  roleSkill: function (flex_text, index, text) {
    let players = this.group_session.players;
    let role = players[index].role;
    
    let skillText = this.getRoleSkillText(role.name);

    let cmdText = this.getRoleCmdText(role.name);
    let canSelfTarget = this.canSelfTarget(role.name);

    /// special role yang bisa berubah selfTarget

    // Juggernaut yang skillLevel udah 3 keatas
    if (role.name === "juggernaut") {
      if (players[index].role.skillLevel >= 3) {
        canSelfTarget = true;
      }
    }

    // special role plaguebearer yang udah pestilence
    if (role.name === "plaguebearer") {
      if (players[index].role.isPestilence) {
        skillText = "Plagubearer, pilih rumah siapa yang ingin kamu serang dengan penyakit sampar!";
        canSelfTarget = true;
      }
    }

    flex_text.body.text += "\n\n" + skillText;

    flex_text.footer = {
      buttons: []
    };

    let button = {};
    for (let i = 0; i < players.length; i++) {
      if (players[i].status === "alive") {
        if (!canSelfTarget && parseInt(index) === parseInt(i)) {
          continue;
        }

        button[i] = {
          action: "postback",
          label: players[i].name,
          data: cmdText + " " + i
        };

        flex_text.footer.buttons.push(button[i]);
      }
    }

    if (text) {
      return this.replyFlex(flex_text, text);
    } else {
      return this.replyFlex(flex_text);
    }
  },

  roleCommand: function () {
    if (this.group_session.state === "new") {
      return this.replyText("💡 Game belum dimulai");
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;
    let player = players[index];
    let state = this.group_session.state;
    let roleName = player.role.name;
    let roleTeam = player.role.team;
    let roleDesc = player.role.description;
    let headerText =
      helper.getRoleNameEmoji(roleName) + " " + roleName.toUpperCase();

    let flex_text = {
      header: {
        text: headerText
      },
      body: {
        text: roleDesc
      }
    };

    if (roleTeam === "mafia" || roleTeam === "vampire") {
      let nightNews =
        "\n\n" + "📣 Yang berada di team " + roleTeam + " : " + "\n";
      let teammates = "";
      if (roleTeam === "mafia") {
        // untuk role team yg ada banyak role name
        teammates = this.getNamesByTeam(roleTeam, true);
      } else {
        // untuk role team yg nama rolenya sama semua
        teammates = this.getNamesByTeam(roleTeam, null);
      }
      nightNews += teammates + "\n";
      flex_text.body.text += nightNews;
    }

    if (player.status === "death" || player.willSuicide) {
      /// Yang bisa skill walaupun dah mati
      if (roleName !== "jester" && roleName !== "guardian-angel") {
        return this.replyFlex(flex_text);
      }
    }

    // special role exe
    if (roleName === "executioner") {
      let exeTarget = players[players[index].role.targetLynchIndex];
      let text = "";

      if (player.role.isTargetLynched) {
        text = "🪓 " + exeTarget.name;
        text += " sudah digantung! Sekarang tinggal sit back and relax";
      } else {
        text = "🪓 Target kamu adalah " + exeTarget.name + ". Kamu harus bisa ";
        text += "menghasut warga untuk gantung dia supaya kamu menang";
      }

      return this.replyFlex(flex_text, text);
    }

    if (state !== "day" && state !== "vote") {
      let text = "";
      /// Special Role Personal chat reminder
      if (roleTeam === "mafia" || roleTeam === "vampire") {
        text +=
          "💡 Kamu bisa chat sama sesama team dengan cmd '/c <kata-yang ingin disampaikan>'" +
          "\n";
        text += "Gunakan cmd '/r' untuk load chat dari team";
      } else if (roleName === "vampire-hunter") {
        text +=
          "💡 Kamu bisa dengar vampire chat-an, gunakan cmd '/r' secara berkala";
      }

      let noNightSkill = ["villager", "executioner", "mayor", "psychic"];

      if (noNightSkill.includes(roleName)) {
        return this.replyFlex(flex_text, text);
      }

      // morphed role message
      if (players[index].addonMessage) {
        text += players[index].addonMessage + "\n";
        players[index].addonMessage = "";
      }

      /// special role skill
      if (roleName === "retributionist") {
        if (player.role.revive > 0 && this.isSomeoneDeath()) {
          return this.retributionistSkill(flex_text);
        } else {
          return this.replyFlex(flex_text);
        }
      } else if (roleName === "veteran") {
        if (player.role.alert > 0) {
          return this.veteranSkill(flex_text);
        } else {
          return this.replyFlex(flex_text);
        }
      } else if (roleName === "vigilante") {
        if (player.role.isLoadBullet) {
          text += "💼 Kamu masih menyiapkan senjata mu";
          return this.replyFlex(flex_text, text);
        }
      } else if (roleName === "jester") {
        if (!player.role.isLynched || player.role.hasRevenged) {
          return this.replyFlex(flex_text);
        } else {
          text += "👻 Kamu pilih siapa saja yang ingin kamu hantui. ";
          text += "Jika tidak besok kamu akan sembarang menghantui orang";
        }
      } else if (roleName === "survivor") {
        if (player.role.vest > 0) {
          return this.survivorSkill(flex_text);
        } else {
          return this.replyFlex(flex_text);
        }
      } else if (roleName === "vampire") {
        let vampireConvertCooldown = this.group_session.vampireConvertCooldown;
        if (vampireConvertCooldown > 0) {
          let infoText =
            "🦇 Kamu harus menunggu " +
            vampireConvertCooldown +
            " malam untuk gigit orang";
          return this.replyFlex(flex_text, [text, infoText]);
        }
      } else if (roleName === "werewolf") {
        if (!this.group_session.isFullMoon) {
          text += "🌓 Masih belum bulan purnama, kamu tidur seperti biasa.";
          return this.replyFlex(flex_text, text);
        }
      } else if (roleName === "juggernaut") {
        let skillLevel = players[index].role.skillLevel;
        if (skillLevel === 0 && !this.group_session.isFullMoon) {
          text +=
            "🌓 Masih belum bulan purnama, kamu tidak membunuh pada malam ini.";
          return this.replyFlex(flex_text, text);
        }
      } else if (roleName === "amnesiac") {
        if (this.isSomeoneDeath()) {
          return this.amnesiacSkill(flex_text);
        } else {
          return this.replyFlex(flex_text);
        }
      } else if (roleName === "guardian-angel") {
        if (player.role.protection > 0) {
          return this.guardianAngelSkill(flex_text);
        } else {
          return this.replyFlex(flex_text);
        }
      }

      // special role private role prop reminder
      if (roleName === "doctor") {
        text +=
          "💉 Kamu memiliki " + players[index].role.selfHeal + " self heal";
      } else if (roleName === "vigilante") {
        text += "🔫 Kamu memiliki " + players[index].role.bullet + " peluru";
      } else if (roleName === "bodyguard") {
        text += "🦺 Kamu memiliki " + players[index].role.vest + " vest";
      }

      // special role untuk arsonist dan plaguebearer //cp
      if (roleName === "arsonist") {
        text += "🛢️ Doused List : " + "\n\n";

        let num = 1;
        let isExists = false;
        players.forEach(item => {
          if (item.status === "alive" && item.doused) {
            isExists = true;
            text += num + ". " + item.name + "\n";
            num++;
          }
        })

        text = text.trim();
        if (!isExists) text = "";
      } else if (roleName === "plaguebearer") {
        text += "☣️ Infected List : " + "\n\n";

        let num = 1;
        let isExists = false;
        players.forEach(item => {
          if (item.status === "alive" && item.infected) {
            isExists = true;
            text += num + ". " + item.name + "\n";
            num++;
          }
        })
        
        text = text.trim();
        if (!isExists) text = "";
      }

      return this.roleSkill(flex_text, index, text);
    } else {
      // state yang pagi tapi ga ada skill pagi
      return this.replyFlex(flex_text);
    }
  },

  retributionistSkill: function (flex_text) {
    let skillText = this.getRoleSkillText("retributionist");
    let players = this.group_session.players;
    let cmdText = this.getRoleCmdText("retributionist");

    flex_text.body.text += "\n\n" + skillText;

    flex_text.footer = {
      buttons: []
    };

    // check for townies only death
    let isTownieDeath = false;

    for (let i = 0; i < players.length; i++) {
      let player = players[i];
      if (player.status === "death" && player.role.team === "villager") {
        isTownieDeath = true;
        break;
      }
    }

    if (!isTownieDeath) {
      return this.replyFlex(flex_text);
    }

    let button = {};
    players.forEach((item, index) => {
      if (item.status === "death") {
        button[index] = {
          action: "postback",
          label: item.name,
          data: cmdText + " " + index
        };

        flex_text.footer.buttons.push(button[index]);
      }
    });

    return this.replyFlex(flex_text);
  },

  amnesiacSkill: function (flex_text) {
    let skillText = this.getRoleSkillText("amnesiac");
    let players = this.group_session.players;
    let cmdText = this.getRoleCmdText("amnesiac");

    flex_text.body.text += "\n\n" + skillText;

    flex_text.footer = {
      buttons: []
    };

    let button = {};
    players.forEach((item, index) => {
      if (item.status === "death") {
        button[index] = {
          action: "postback",
          label: item.name,
          data: cmdText + " " + index
        };

        flex_text.footer.buttons.push(button[index]);
      }
    });

    return this.replyFlex(flex_text);
  },

  guardianAngelSkill: function (flex_text) {
    let skillText = this.getRoleSkillText("guardian-angel");
    let players = this.group_session.players;
    let cmdText = this.getRoleCmdText("guardian-angel");
    let index = this.indexOfPlayer();

    flex_text.body.text += "\n\n" + skillText + "\n\n";

    let targetIndex = players[index].role.mustProtectIndex;
    let targetName = players[targetIndex].name;

    flex_text.body.text += "⚔️ Kamu bisa protect " + targetName + " ";
    flex_text.body.text += players[index].role.protection + " kali lagi";

    flex_text.footer = {
      buttons: [
        {
          action: "postback",
          label: "Protect dia!",
          data: cmdText
        }
      ]
    };

    return this.replyFlex(flex_text);
  },

  veteranSkill: function (flex_text) {
    let skillText = this.getRoleSkillText("veteran");
    let players = this.group_session.players;
    let cmdText = this.getRoleCmdText("veteran");
    let index = this.indexOfPlayer();

    flex_text.body.text += "\n\n" + skillText + "\n\n";

    flex_text.body.text += "💥 Alertmu sisa " + players[index].role.alert;

    flex_text.footer = {
      buttons: [
        {
          action: "postback",
          label: "Alert!",
          data: cmdText
        }
      ]
    };

    return this.replyFlex(flex_text);
  },

  survivorSkill: function (flex_text) {
    let skillText = this.getRoleSkillText("survivor");
    let players = this.group_session.players;
    let cmdText = this.getRoleCmdText("survivor");
    let index = this.indexOfPlayer();

    flex_text.body.text += "\n\n" + skillText + "\n\n";

    flex_text.body.text += "🦺 Vest mu sisa " + players[index].role.vest;

    flex_text.footer = {
      buttons: [
        {
          action: "postback",
          label: "use vest",
          data: cmdText
        }
      ]
    };

    return this.replyFlex(flex_text);
  },

  protectCommand: function () {
    let index = this.indexOfPlayer();
    let players = this.group_session.players;
    let state = this.group_session.state;

    if (state === "day") {
      return this.replyText("💡 Bukan saatnya menggunakan skill");
    }

    let roleName = players[index].role.name;

    if (roleName !== "guardian-angel") {
      return this.replyText("💡 Role mu bukan Guardian Angel");
    }

    if (players[index].role.protection === 0) {
      return this.replyText(
        "💡 Kamu sudah tidak memiliki protection yang tersisa"
      );
    }

    let targetIndex = this.group_session.players[index].role.mustProtectIndex;

    this.group_session.players[index].target.index = targetIndex;

    let text = "";
    let msg = [];

    let doer = {
      name: players[index].name,
      roleName: roleName,
      targetName: players[targetIndex].name,
      selfTarget: false,
      changeTarget: false
    };
    text = skillText.response(doer, null);
    msg = [text];

    return this.replyText(msg);
  },

  alertCommand: function () {
    let index = this.indexOfPlayer();
    let players = this.group_session.players;
    let state = this.group_session.state;

    if (state === "day") {
      return this.replyText("💡 Bukan saatnya menggunakan skill");
    }

    let roleName = players[index].role.name;

    if (roleName !== "veteran") {
      return this.replyText("💡 Role mu bukan Veteran");
    }

    if (players[index].status === "death") {
      return this.replyText("💡 Kamu sudah mati");
    }

    if (players[index].willSuicide) {
      return this.replyText(
        "💡 Kamu sudah tak ada semangat menggunakan skill lagi"
      );
    }

    if (players[index].role.alert === 0) {
      return this.replyText("💡 Kamu sudah tidak memiliki alert yang tersisa");
    }

    this.group_session.players[index].target.index = index;

    let text = "";
    let msg = [];

    let doer = {
      name: players[index].name,
      roleName: roleName,
      targetName: "",
      selfTarget: false,
      changeTarget: false
    };
    text = skillText.response(doer, null);
    msg = [text];

    if (players[index].role.canKill && players[index].deathNote === "") {
      let dnoteText =
        "💡 Kamu belum buat death note, ketik '/dnote' <isi note kamu>";
      msg.push(dnoteText);
    }

    return this.replyText(msg);
  },

  vestCommand: function () {
    let index = this.indexOfPlayer();
    let players = this.group_session.players;
    let state = this.group_session.state;

    if (state === "day") {
      return this.replyText("💡 Bukan saatnya menggunakan skill");
    }

    let roleName = players[index].role.name;

    if (roleName !== "survivor") {
      return this.replyText("💡 Role mu bukan Survivor");
    }

    if (players[index].status === "death") {
      return this.replyText("💡 Kamu sudah mati");
    }

    if (players[index].role.vest === 0) {
      return this.replyText("💡 Kamu sudah tidak memiliki Vest yang tersisa");
    }

    this.group_session.players[index].target.index = index;

    let text = "";
    let msg = [];

    let doer = {
      name: players[index].name,
      roleName: roleName,
      targetName: "",
      selfTarget: false,
      changeTarget: false
    };
    text = skillText.response(doer, null);
    msg = [text];

    return this.replyText(msg);
  },

  announceCommand: function () {
    if (this.group_session.state === "new") {
      return this.replyText("💡 Game belum dimulai");
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;
    let state = this.group_session.state;

    if (state === "night" || players[index].status === "death") {
      return this.journalCommand();
    }

    let flex_texts = [
      {
        header: {
          text: "🌙 Berita Malam ke - " + this.group_session.nightCounter
        },
        body: {
          text: players[index].message
        }
      }
    ];

    if (players[index].status === "alive") {
      flex_texts.push({
        header: {
          text: "📣 Info"
        },
        body: {
          text: "☝️ Kembali ke group chat untuk voting"
        }
      });
    }

    let journals = players[index].journals;

    if (journals.length === 2) {
      return this.replyFlex(
        flex_texts,
        "📓 Kamu bisa cek journal kamu dengan '/jurnal'"
      );
    } else {
      return this.replyFlex(flex_texts);
    }
  },

  journalCommand: function () {
    if (this.group_session.state === "new") {
      return this.replyText("💡 Game belum dimulai");
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;
    let journals = players[index].journals;

    if (journals.length === 0) {
      return this.replyText("💡 Kamu belum memiliki jurnal");
    }

    let flex_texts = [];
    let flex_text = {};

    journals.forEach((item, idx) => {
      flex_text[idx] = {
        header: {
          text: "📓 Malam - " + item.nightCounter
        },
        body: {
          text: item.content
        }
      };
      flex_texts.push(flex_text[idx]);
    });

    return this.replyFlex(flex_texts);
  },

  refreshCommand: function () {
    if (this.group_session.state !== "night") {
      if (this.group_session.state === "new") {
        return this.replyText("💡 Game belum dimulai");
      } else {
        return this.replyText("💡 Belum saatnya chatting");
      }
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;
    let roleName = players[index].role.name;
    let roleTeam = players[index].role.team;

    if (players[index].status === "death") {
      return this.replyText("💡 Kamu sudah mati");
    }

    if (roleTeam !== "mafia" && roleTeam !== "vampire") {
      if (roleName !== "vampire-hunter") {
        return this.replyText(
          "💡 Team " + roleTeam + " gak ada komunikasi malam"
        );
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
      return this.replyText(noChat);
    }

    if (roleName === "vampire-hunter") {
      roleTeam = "vampire";
    }

    let text = "💬 " + roleTeam.toUpperCase() + " Chat" + "\n\n";

    chatBox.forEach((item, index) => {
      text += item.name + " : " + item.text + "\n";
    });

    return this.replyText(text);
  },

  chatCommand: function () {
    if (this.group_session.state !== "night") {
      if (this.group_session.state === "new") {
        return this.replyText("💡 Game belum dimulai");
      } else {
        return this.replyText("💡 Belum saatnya chatting");
      }
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;
    let roleTeam = players[index].role.team;
    let roleName = players[index].role.name;

    if (roleTeam !== "mafia" && roleTeam !== "vampire") {
      return this.replyText("💡 " + roleTeam + " gak ada komunikasi malam");
    }

    if (players[index].status === "death") {
      return this.replyText(
        "💡 Sudah mati, gak bisa chat dengan yang beda dunia"
      );
    }

    if (this.args.length < 2) {
      return this.replyText("💡 isi chat kamu dengan '/c <kata-kata nya>'");
    }

    let message = {
      name: players[index].name,
      text: helper.parseToText(this.args)
    };

    if (roleTeam === "mafia") {
      this.group_session.mafiaChat.push(message);
    } else if (roleTeam === "vampire") {
      this.group_session.vampireChat.push(message);

      // for vampire hunter
      let toVampireHunterMsg = {
        name: "Vampire",
        text: helper.parseToText(this.args)
      };
      this.group_session.vampireHunterChat.push(toVampireHunterMsg);
    }

    return this.replyText("💡 Pesan terkirim! Check chat dengan '/r'");
  },

  infoCommand: function () {
    const roles = require("/app/roles/rolesInfo");
    return roles.receive(this.client, this.event, this.args);
  },

  invalidCommand: function () {
    const invalid = require("/app/message/invalid");
    let text = invalid.getResponse(this.args, this.user_session.name);
    return this.replyText(text);
  },

  helpCommand: function () {
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

  commandCommand: function () {
    let text = "";
    let cmds = [
      "/news : cek berita (malam dibunuh siapa, dll)",
      "/role : cek role",
      "/info : list role",
      "/help : bantuan game",
      "/journal : cek journal kamu",
      "/revoke: untuk batal menggunakan skill",
      "/roles : tampilin role list"
    ];

    cmds.forEach((item, index) => {
      text += "- " + item;
      if (index !== cmds.length - 1) {
        text += "\n";
      }
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

  /** helper func **/

  canSelfTarget: function (roleName) {
    let can = false;

    let cantTargetItSelf = [
      "godfather",
      "mafioso",
      "escort",
      "consigliere",
      "investigator",
      "vampire",
      "vampire-hunter",
      "vigilante",
      "escort",
      "serial-killer",
      "retributionist",
      "lookout",
      "sheriff",
      "jester",
      "spy",
      "tracker",
      "disguiser",
      "framer",
      "juggernaut",
      "amnesiac",
      "guardian-angel",
      "plaguebearer"
    ];

    if (cantTargetItSelf.includes(roleName)) {
      return can;
    } else {
      can = true;
      return can;
    }
  },

  isSomeoneDeath: function () {
    let found = false;
    let players = this.group_session.players;
    for (let i = 0; i < players.length; i++) {
      if (players[i].status === "death") {
        found = true;
        return found;
      }
    }
    return found;
  },

  /*
  teamName string nama team
  withRoleName bool kasih roleName juga
  */
  getNamesByTeam: function (teamName, withRoleName) {
    let names = [];
    this.group_session.players.forEach((item, index) => {
      if (item.status === "alive" && item.role.team === teamName) {
        let name = item.name;
        if (withRoleName) {
          name += " (" + item.role.name + ")";
        }
        names.push(name);
      }
    });
    return names.join(", ");
  },

  indexOfPlayer: function () {
    let found = -1;
    for (let i = 0; i < this.group_session.players.length; i++) {
      if (this.group_session.players[i].id === this.user_session.id) {
        found = i;
        return found;
      }
    }
    return found;
  },

  getRoleSkillText: function (roleName) {
    for (let i = 0; i < rolesData.length; i++) {
      if (roleName === rolesData[i].name) {
        return rolesData[i].skillText;
      }
    }
  },

  getRoleCmdText: function (roleName) {
    for (let i = 0; i < rolesData.length; i++) {
      if (roleName === rolesData[i].name) {
        return rolesData[i].cmdText;
      }
    }
  },

  /** message func **/

  /* 
  flex_raws dan newFlexRaws sama aja
  text_raws sama seperti param di replyText func
  */
  replyFlex: function (flex_raws, text_raws, newFlex_raws) {
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
          reminder +=
            "Waktu sudah habis, ketik '/cek' di group untuk lanjutkan proses";
        } else {
          reminder +=
            "Waktu tersisa " +
            time +
            " detik lagi, nanti ketik '/cek' di group untuk lanjutkan proses";
        }

        let reminder_text = {
          type: "text",
          text: reminder
        };

        opt_texts.push(reminder_text);
      }
    } else {
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
    }

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

  replyText: function (texts = []) {
    texts = Array.isArray(texts) ? texts : [texts];

    let time = this.group_session.time;
    let state = this.group_session.state;

    let sender = {
      name: "",
      iconUrl: ""
    };

    if (state !== "idle" && state !== "new") {
      sender.name = "Moderator";
      sender.iconUrl =
        "https://cdn.glitch.com/fc7de31a-faeb-4c50-8a38-834ec153f590%2F%E2%80%94Pngtree%E2%80%94microphone%20vector%20icon_3725450.png?v=1587456628843";
    } else {
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
        "err di replyText di personal.js",
        err.originalError.response.data
      );
    });
  }
};
