const helper = require("/app/helper");

module.exports = {
  receive: function(client, event, args, group_session) {
    this.client = client;
    this.event = event;
    this.args = args;
    this.group_session = group_session;

    if (!this.args[1]) {
      return this.commandCommand();
    }

    switch (this.args[1]) {
      case "mode":
        return this.setModeCommand();
      default:
        return this.invalidCommand();
    }
  },

  commandCommand: function() {
    let text = "";

    let cmds = [
      "/set mode : untuk lihat mode game yang ada",
      "/set mode <nama mode> : untuk set ke mode yang diinginkan"
    ];

    cmds.forEach((item, index) => {
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

  setModeCommand: function() {
    let modeList = helper.getModeList();
    let found = false;

    if (!this.args[2]) {
      let list = modeList.join(", ");
      let text = "📜 Mode List : " + "\n";
      text += list;
      return this.replyText(text);
    }

    for (let i = 0; i < modeList.length; i++) {
      let mode = modeList[i];
      if (this.args[2] === mode) {
        this.group_session.mode = mode;
        found = true;
        return this.replyText("🕹️ Game mode berhasil diubah ke " + mode + "!");
      }
    }

    if (!found) {
      let text = "💡 Tidak ditemukan mode " + this.args[2] + ". ";
      text += "Jika ada ide, boleh share ya";
      return this.replyText(text);
    }
  },

  /** Message func **/

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return this.client.replyMessage(
      this.event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
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

    const flex = require("/app/message/flex");
    return flex.receive(this.client, this.event, flex_texts, opt_texts);
  }
};
