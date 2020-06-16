const helper = require("/app/helper");

module.exports = {
  receive: function(client, event, args, groupState) {
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

    let errorText = "💡 Tidak ada ditemukan info mode '";
    errorText += this.args[2] + "' pada mode list. ";
    errorText += "Cek info mode yang ada dengan cmd '/info mode'";

    /// check untuk role
    let modeId = -1;
    switch (input) {
      case "vampire":
      case "1":
        flex_text.header.text = "🦇🧛 Vampire Mode";
        flex_text.body.text += "Mode ID: 1" + "\n\n";
        flex_text.body.text +=
          "Disana Vampire, disini Vampire, dimana mana ada Vampire. ";
        modeId = 1;
        break;

      case "chaos":
      case "2":
        flex_text.header.text = "🃏🪓 Chaos Mode";
        flex_text.body.text += "Mode ID: 2" + "\n\n";
        flex_text.body.text +=
          "Sesuai namanya, role role yang ada beneran buat chaos. ";
        modeId = 2;
        break;

      case "classic":
      case "3":
        flex_text.header.text = "👨‍🌾🤵 Classic Mode";
        flex_text.body.text += "Mode ID: 3" + "\n\n";
        flex_text.body.text += "Mode normal, cocok untuk pemula. ";
        modeId = 3;
        break;

      case "survive":
      case "4":
        flex_text.header.text = "🏳️🦺 Survive Mode";
        flex_text.body.text += "Mode ID: 4" + "\n\n";
        flex_text.body.text +=
          "Sebagian besar dari kalian hanyalah Survivor yang ingin tetap hidup. ";
        modeId = 4;
        break;

      case "killing wars":
      case "5":
        flex_text.header.text = "🤵🔥 Killing Wars Mode";
        flex_text.body.text += "Mode ID: 5" + "\n\n";
        flex_text.body.text +=
          "Warga telah binasa, sekarang Mafia masih menghadapi ancaman yang lain!";
        modeId = 5;
        break;

      case "who there":
      case "who's there":
      case "6":
        flex_text.header.text = "🚷👮 Who's There? Mode";
        flex_text.body.text += "Mode ID: 6" + "\n\n";
        flex_text.body.text +=
          "Warga masih berusaha membasmi para penjahat. Namun para Escort terkadang merepotkan warga";
        modeId = 6;
        break;

      case "trust issue":
      case "7":
        flex_text.header.text = "🎞️🔍 Trust Issue Mode";
        flex_text.body.text += "Mode ID: 7" + "\n\n";
        flex_text.body.text +=
          "Warga di buat kesal, karena salah menggantung orang yang dikira Mafia. ";
        flex_text.body.text += "Padahal role nya adalah Sheriff. ";
        flex_text.body.text +=
          "Seer yang sebelumnya dipercayai warga, telah membuat para warga kecewa. ";
        flex_text.body.text +=
          "Padahal Seer sudah yakin akan terawangannya. Sayangnya, semalam Sheriff di frame!";
        modeId = 7;
        break;

      case "who are you":
      case "8":
        flex_text.header.text = "🎭 Who Are You? Mode";
        flex_text.body.text += "Mode ID: 8" + "\n\n";
        flex_text.body.text +=
          "Mengimitasi adalah jalan ninja ku" + "\n\n" + "- Disguiser";
        modeId = 8;
        break;

      case "new threat":
      case "9":
        flex_text.header.text = "🔪 New Threat Mode";
        flex_text.body.text += "Mode ID: 9" + "\n\n";
        flex_text.body.text +=
          "Warga senang sekali setelah berhasil membasmi Mafia, ";
        flex_text.body.text +=
          "Namun mereka tidak sadar bahwa ada bahaya yang mengintai selain Mafia..";
        modeId = 9;
        break;

      case "clown town":
      case "10":
        flex_text.header.text = "🃏 Clown Town Mode";
        flex_text.body.text += "Mode ID: 10" + "\n\n";
        flex_text.body.text +=
          "Katanya, orang jahat adalah orang baik yang disakiti. " +
          "\n\n" +
          "apa benar?";
        modeId = 10;
        break;

      case "amnesiac chaos":
      case "11":
        flex_text.header.text = "🤕 Amnesiac Chaos Mode";
        flex_text.body.text += "Mode ID: 11" + "\n\n";
        flex_text.body.text +=
          "Dengan tiba tiba, banyak orang yang hilang ingatan sejak Agent K menggunakan Memory Eraser di kota Bedburg";
        modeId = 11;
        break;

      case "friday 13":
      case "12":
        flex_text.header.text = "🔪 Friday 13th Mode";
        flex_text.body.text += "Mode ID: 12" + "\n\n";
        flex_text.body.text +=
          "Kunci pintu rumah kalian, kunci jendela, jangan sampai Jason datang dan membunuh kalian!";
        modeId = 12;
        break;

      default:
        return this.replyText(errorText);
    }

    if (this.event.source.type !== "user") {
      if (groupState === "idle" || groupState === "new") {
        flex_text.footer = {
          buttons: [
            {
              action: "postback",
              label: "set mode ini",
              data: "/set mode " + modeId
            }
          ]
        };
      }
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
      "Cth: '/info mode who's there' untuk mengetahui deskripsi mode Who's There";
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
