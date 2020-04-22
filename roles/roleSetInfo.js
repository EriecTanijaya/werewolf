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
    if (this.args[3]) {
      input = this.parseToText(this.args);
    } else {
      input = this.args[2].replace("-", " ");
    }
    input = input.toLowerCase();

    /// check untuk role
    switch (input) {
      case "vampire":
        flex_text.header.text = "🦇🧛 Vampire Mode";
        flex_text.body.text +=
          "Disana Vampire, disini Vampire, dimana mana ada Vampire. ";
        break;

      case "chaos":
        flex_text.header.text = "🃏🪓 Chaos Mode";
        flex_text.body.text +=
          "Sesuai namanya, role role yang ada beneran buat chaos. ";
        break;

      case "classic":
        flex_text.header.text = "👨‍🌾🐺 Classic Mode";
        flex_text.body.text += "Mode normal, cocok untuk pemula. ";
        break;

      case "survive":
        flex_text.header.text = "🏳️🦺 Survive Mode";
        flex_text.body.text +=
          "Sebagian besar dari kalian hanyalah Survivor yang ingin tetap hidup. ";
        break;

      case "killing wars":
        flex_text.header.text = "🐺🔥 Killing Wars Mode";
        flex_text.body.text +=
          "Warga telah binasa, sekarang Werewolf masih menghadapi ancaman yang lain!";
        break;

      case "who there":
      case "who's there":
        flex_text.header.text = "🚷👮 Who's There? Mode";
        flex_text.body.text +=
          "Warga masih berusaha membasmi para penjahat. Namun para Escort terkadang merepotkan warga";
        break;

      case "trust issue":
        flex_text.header.text = "🎞️🔮 Trust Issue Mode";
        flex_text.body.text +=
          "Warga di buat kesal, karena salah menggantung orang yang dikira Werewolf. ";
        flex_text.body.text += "Padahal role nya adalah Sheriff. ";
        flex_text.body.text +=
          "Seer yang sebelumnya dipercayai warga, telah membuat para warga kecewa. ";
        flex_text.body.text +=
          "Padahal Seer sudah yakin akan terawangannya. Sayangnya, semalam Sheriff di frame!";
        break;

      default:
        let text =
          "💡 Tidak ada ditemukan info mode '" +
          this.args[2] +
          "' pada mode list. ";
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
      "\n\n" + "Cth: '/info mode chaos' untuk mengetahui deskripsi mode" + "\n";
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

    let sender = {
      name: "",
      iconUrl: ""
    };

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

    let msg = texts.map(text => {
      return {
        sender: sender,
        type: "text",
        text: text.trim()
      };
    });

    return this.client.replyMessage(this.event.replyToken, msg).catch(err => {
      console.log(
        "err di replyText di rolesSetInfo.js",
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

    const flex = require("/app/message/flex");
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
