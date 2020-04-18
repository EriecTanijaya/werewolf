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
      input = helper.parseToText(this.args);
    } else {
      input = this.args[2].replace("-", " ");
    }
    input = input.toLowerCase();

    /// check untuk role
    switch (input) {
      case "ww vs neutral":
      case "neutral vs ww":
        flex_text.header.text = "🐺🔥 Werewolf X Neutral";
        flex_text.body.text += "Mode game dimana banyak Werewolf dan Neutral";
        break;

      case "mode vampire":
        flex_text.header.text = "🦇🧛 Vampire Mode";
        flex_text.body.text += "Mode game dimana banyak Werewolf dan Neutral";
        break;

      case "chaos":
        break;

      case "classic":
        break;
    }
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
      "Cth: '/info ww-vs-neutral' untuk mengetahui deskripsi mode Vampire-Hunter" +
      "\n";
    flex_text.body.text += "Untuk set mode bisa ketik '/set mode <nama-mode>'";
    return this.replyFlex(flex_text);
  }
};
