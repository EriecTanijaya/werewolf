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
    
  }
}