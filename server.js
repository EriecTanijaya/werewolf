// server.js
// where your node app starts

// init project
const line = require("@line/bot-sdk");
const express = require("express");
const app = express();

// line config
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

app.use("/callback", line.middleware(config));

app.get("/", (req, res) => res.sendStatus(200));

const client = new line.Client(config);

app.post("/callback", (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(err => {
      console.error("error di app.post", err);
    });
});

function handleEvent(event) {
  //Note: should return! So Promise.all could catch the error
  if (event.type === "postback") {
    let rawArgs = event.postback.data;
    const data = require("/app/src/data");
    return data.receive(client, event, rawArgs);
  }

  if (event.type !== "message" || event.message.type !== "text") {
    let otherEvents = ["join", "follow", "leave", "memberJoined", "memberLeft"];
    if (otherEvents.includes(event.type)) {
      const other = require("/app/src/other");
      return other.receive(client, event);
    }

    return Promise.resolve(null);
  }

  //logging
  if (event.source.type === "group") {
    //logChat(event.source.groupId, event.source.userId);
  }

  let rawArgs = event.message.text;
  const data = require("/app/src/data");
  return data.receive(client, event, rawArgs);

  /** logging func **/

  function logChat(groupId, userId) {
    client
      .getGroupMemberProfile(groupId, userId)
      .then(p => {
        console.log(
          groupId + " // " + p.displayName + " : " + event.message.text
        );
      })
      .catch(() => {
        console.log(groupId + " // " + "ga add : " + event.message.text);
      });
  }
}

// listen for requests :)
const port = 3000;
app.listen(port, () => {
  console.log("Your app is listening on port " + port);
});
