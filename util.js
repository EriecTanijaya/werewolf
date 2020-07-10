const leaveGroup = (groupId, text) => {
  return this.client
    .replyMessage(this.event.replyToken, {
      type: "text",
      text: text
    })
    .then(() => {
      if (this.event.source.type === "group") {
        this.client.leaveGroup(groupId);
      } else {
        this.client.leaveRoom(groupId);
      }
    });
};

module.exports = {
  leaveGroup,
}