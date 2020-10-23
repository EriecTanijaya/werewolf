const line = require("@line/bot-sdk");
const express = require("express");
const app = express();

// initialize module
const data = require("./src/data");

// line config
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

app.use("/callback", line.middleware(config));

app.get("/", (req, res) => res.sendStatus(200));

app.post("/callback", (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(err => {
      console.error("error di app.post", err);
    });
});

async function handleEvent(event) {
  //Note: should return! So Promise.all could catch the error
  if (event.type === "postback") {
    let rawArgs = event.postback.data;
    return data.receive(event, rawArgs);
  }

  if (event.type !== "message" || event.message.type !== "text") {
    const otherEvents = ["follow", "memberJoined", "join", "leave", "memberLeft", "unfollow"];
    if (otherEvents.includes(event.type)) {
      return data.receive(event, "");
    } else if (event.type === "message") {
      return data.receive(event, event.message.type);
    }

    return Promise.resolve(null);
  }

  let rawArgs = event.message.text;
  return data.receive(event, rawArgs);
}

// listen for requests :)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Your app is listening on port " + port);
});
