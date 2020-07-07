const helper = require("/app/helper");
const rolesData = require("/app/roles/rolesData");
const flex = require("/app/message/flex");

module.exports = {
  receive: function(client, event, args, group_session, user_session) {
    this.client = client;
    this.event = event;
    this.args = args;
    this.group_session = group_session;
    this.user_session = user_session;

    if (!this.args[1]) {
      return this.commandCommand();
    }

    switch (this.args[1]) {
      case "mode":
        return this.setModeCommand();
      case "show_role":
        return this.setShowRoleCommand();
      case "role":
        return this.setRoleCommand();
      default:
        return this.invalidCommand();
    }
  },

  invalidCommand: function() {
    let text = "💡 Tidak ada command " + this.args[1] + ". ";
    text += "Cek daftar command dengan ketik '/set'";
    return this.replyText(text);
  },

  commandCommand: function() {
    let text = "";

    let cmds = [
      "/set mode : untuk lihat mode game yang ada",
      "/set mode <nama mode> : untuk set ke mode yang diinginkan",
      "/set mode random : untuk set game mode secara random",
      "/set show_role <yes/no> : untuk set apakah ingin tampilkan list tipe role yang ada di suatu game",
      "/set role : untuk set custom role"
    ];

    cmds.forEach(item => {
      text += "- " + item + "\n";
    });

    let flex_text = {
      header: {
        text: "⚙️ Daftar Perintah"
      },
      body: {
        text: text
      }
    };
    return this.replyFlex(flex_text);
  },

  setRoleCommand: function() {
    if (!this.args[2]) {
      let text = "📜 Untuk set custom role contohnya seperti ini : " + "\n";
      text += "'/set role mafioso sheriff serial-killer bodyguard'" + "\n\n";
      text += "💡 Setiap role dipisahkan dengan spasi";
      return this.replyText(text);
    }

    if (this.group_session.state === "idle") {
      return this.replyText(
        "💡 Belum ada game yang dibuat, ketik '/new' untuk buat game baru"
      );
    }

    if (this.group_session.roomHostId !== this.user_session.id) {
      return this.replyText(
        "💡 Hanya pembuat room game saja yang bisa atur Custom Role!"
      );
    }

    this.args.splice(0, 2);

    let customRoles = this.args;

    let errors = [];

    // check unknown role
    let knownRoleNames = rolesData.map(role => {
      return role.name;
    });

    customRoles.forEach(item => {
      if (!knownRoleNames.includes(item)) {
        errors.push(`💡 Tidak ditemukan '${item}' pada daftar role`);
      }
    });

    // check needed team
    let knownRoles = rolesData.map(role => {
      return {
        name: role.name,
        team: role.team
      };
    });

    let teams = [];
    let neutrals = [
      "executioner",
      "jester",
      "survivor",
      "amnesiac",
      "guardian-angel"
    ];

    for (let i = 0; i < customRoles.length; i++) {
      for (let u = 0; u < knownRoles.length; u++) {
        let knownRoleName = knownRoles[u].name;
        if (knownRoleName === customRoles[i]) {
          if (neutrals.includes(customRoles[i])) {
            continue;
          }

          if (!teams.includes(knownRoles[u].team)) {
            teams.push(knownRoles[u].team);
          }
        }
      }
    }

    if (teams.length < 2) {
      errors.push("💡 Masukkan minimal 2 team yang berlawanan dalam 1 game.");
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
      errors.push(
        "💡 Masukkan setidaknya 1 warga jika ingin menggunakan role Executioner"
      );
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
        errors.push(
          "💡 Masukkan role Vampire jika ingin menggunakan role Vampire Hunter"
        );
      }
    }

    // sheriff
    if (has("sheriff")) {
      let suspiciousList = [
        "mafioso",
        "consigliere",
        "consort",
        "serial-killer",
        "framer",
        "disguiser"
      ];

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
      errors.push(
        "💡 Masukkan setidaknya 1 warga jika ingin menggunakan role Retributionist"
      );
    }
    
    // framer
    if (has("framer")) {
      let townInvestigate = [
        "sheriff",
        "investigator"
      ]
      
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

      return this.replyText(text);
    }

    this.group_session.customRoles = customRoles;
    this.group_session.mode = "custom";

    let text = "📜 Roles : " + customRoles.join(", ") + "\n\n";
    text += "💡 Untuk meggunakan mode yang lain bisa dengan cmd '/set mode'";

    let flex_text = {
      header: {
        text: "📣 Custom Roles Set!"
      },
      body: {
        text: text
      }
    };

    return this.replyFlex(flex_text);
  },

  setShowRoleCommand: function() {
    if (!this.args[2]) {
      let text =
        "📜 Jika show_role no, maka tidak bisa akses cmd '/roles' pada game";
      return this.replyText(text);
    }

    let input = this.args[2].toLowerCase();

    let text = "✉️ ";
    if (input === "yes" || input === "y") {
      this.group_session.isShowRole = true;
      text += "Show role diaktifkan!";
    } else if (input === "no" || input === "n") {
      this.group_session.isShowRole = false;
      text += "Show role di non-aktifkan!";
    } else {
      return this.replyText("💡 Gunakan /set show_role yes atau no");
    }

    return this.replyText(text);
  },

  setModeCommand: function() {
    let modeList = helper.getModeList();
    let found = false;

    if (!this.args[2]) {
      let list = modeList.join(", ");
      let text = "📜 Mode List : " + "\n";
      text += list + "\n\n";
      text += "Cth: Untuk set mode bisa ketik '/set mode who's-there";
      return this.replyText(text);
    }

    if (this.args[2] === "random") {
      let randomMode = helper.random(modeList);
      return this.replyText(
        "🎲 Game mode di ubah ke " + randomMode + " secara random!"
      );
    }

    if (this.args[2] === "custom") {
      let text = "📜 Untuk set custom role contohnya seperti ini : " + "\n";
      text += "'/set role mafioso sheriff serial-killer bodyguard'" + "\n\n";
      text += "💡 Setiap role dipisahkan dengan spasi";
      return this.replyText(text);
    }

    for (let i = 0; i < modeList.length; i++) {
      let mode = modeList[i];
      let modeId = i + 1;
      if (this.args[2] === mode || this.args[2] == modeId) {
        found = true;
        if (this.group_session.mode === mode) {
          let text = "💡 " + this.user_session.name + ", ";
          text += "game mode nya sudah di set ke " + mode;
          return this.replyText(text);
        } else {
          this.group_session.mode = mode;
          return this.replyText(
            "🕹️ Game mode berhasil diubah ke " + mode + "!"
          );
        }
      }
    }

    if (!found) {
      let text = "💡 Tidak ditemukan mode " + this.args[2] + ". ";
      text += "Lihat daftar mode dengan '/info mode'";
      return this.replyText(text);
    }
  },

  /** Message func **/

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
        "err di replyText di setting.js",
        err.originalError.response.data
      );
    });
  },

  replyFlex: function(flex_raws, text_raws) {
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
      null,
      null,
      sender
    );
  }
};
