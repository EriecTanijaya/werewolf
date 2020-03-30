// server.js
// where your node app starts

// init project
const line = require("@line/bot-sdk");
const express = require("express");
const app = express();
const CronJob = require("cron").CronJob;

// line config
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

let requestsQuota = 66 // in 1 minute
app.use((req, res, next) => {
  requestsQuota--;
  next();
});

// for update rank once a week, on thursday
// Thanks https://crontab.guru/examples.html
const updateRankJob = new CronJob("0 0 * * */4", function() {
  const reset = require("/app/src/reset");
  reset.usersPoint();
});

updateRankJob.start();

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

async function handleEvent(event) {
  if (requestsQuota <= 0) {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: text
    })
  }
  
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

  async function logChat(groupId, userId) {
    let user = groupId + " // ";
    try {
      let profile = await client.getGroupMemberProfile(groupId, userId);
      user += profile.displayName;
    } catch (err) {
      user += "ga add";
    }
    console.log(user + " : " + event.message.text);
  }
}

// listen for requests :)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Your app is listening on port " + port);
});
