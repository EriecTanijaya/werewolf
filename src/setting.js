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
      "/set show_role <yes/no> : untuk set apakah ingin tampilkan list tipe role yang ada di suatu game"
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
