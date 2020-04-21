const helper = require("/app/helper");

module.exports = {  
  replyText: function(client, event, texts) {
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

    return client.replyMessage(event.replyToken, msg).catch(err => {
      console.log(
        "err di replyText di personal.js",
        err.originalError.response.data
      );
    });
  },
}