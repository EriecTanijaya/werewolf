module.exports = {
  receive: function(client, event, args, group_session) {
    this.client = client;
    this.event = event;
    this.args = args;
    this.group_session = group_session;
    
    if (!this.args[1]) {
      return this.commandCommand();
    }
    
    switch(this.args[1]) {
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
    let modeList = this.getModeList();
    
    if (!this.args[2]) {
      let list = modeList.join(", ");
      let text = "📜 Mode List : " + "\n";
      text += list;
      return text;
    }
    
    for (let i = 0; i < modeList.length; i++) {
      if (this.args[2] === modeList[i]) {
        this.group_session.mode =
        break;
      }
    }
    
  },
  
  getModeList: function() {
    let modeList = ["classic", "vampire", "chaos", "ww-vs-neutral"];
    return modeList;
  }
  
}