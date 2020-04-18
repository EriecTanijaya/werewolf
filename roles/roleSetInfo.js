const helper = require("/app/helper");

module.exports = {
  receive: function(client, event, args) {
    this.client = client;
    this.event = event;
    this.args = args;

    let flex_text = {
      header: {
        text: ""
      },
      body: {
        text: ""
      }
    };

    if (!this.args[2]) {
      return this.roleSetCommand();
    }

    let input = "";
    if (this.args[2]) {
      input = this.parseToText(this.args);
    } else {
      input = this.args[2].replace("-", " ");
    }
    input = input.toLowerCase();

    console.log(input);
    /// check untuk role
    switch (input) {
      case "ww vs neutral":
      case "neutral vs ww":
      case "ww-vs-neutral":
      case "neutral-vs-ww":
        flex_text.header.text = "🐺🔥 Werewolf X Neutral";
        flex_text.body.text += "Mode game dimana banyak Werewolf dan Neutral. ";
        break;

      case "vampire":
        flex_text.header.text = "🦇🧛 Vampire Mode";
        flex_text.body.text += "Disana Vampire, disini Vampire. ";
        break;

      case "chaos":
        flex_text.header.text = "🃏🪓 Chaos Mode";
        flex_text.body.text += "Sesuai namanya, role role yang ada beneran buat chaos. ";
        break;

      case "classic":
        break;

      default:
        let text =
          "💡 Tidak ada ditemukan info mode '" + this.args[2] + "' pada mode list. ";
        text += "Cek info mode yang ada dengan cmd '/info mode'";
        return this.replyText(text);
    }

    return this.replyFlex(flex_text);
  },

  roleSetCommand: function() {
    let modeList = helper.getModeList();

    let flex_text = {
      header: {
        text: ""
      },
      body: {
        text: ""
      }
    };

    flex_text.header.text = "📜 Mode List 🔮";
    flex_text.body.text = modeList.join(", ");
    flex_text.body.text +=
      "\n\n" +
      "Cth: '/info mode ww-vs-neutral' untuk mengetahui deskripsi mode" +
      "\n";
    flex_text.body.text += "Untuk set mode bisa ketik '/set mode <nama-mode>'";
    return this.replyFlex(flex_text);
  },

  parseToText: function(arr) {
    let text = "";
    arr.forEach(function(item, index) {
      if (index !== 0) {
        //ini untuk tidak parse text command '/command'
        if (index !== 1) {
          if (index !== 2) {
            text += " ";
          }
          text += item;
        }
      }
    });
    return text;
  },

  /** message func **/

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
