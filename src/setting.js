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
      "/set mode < : untuk "
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
  
}