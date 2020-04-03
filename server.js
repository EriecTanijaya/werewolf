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
const client = new line.Client(config);

let requestsQuota = 75; // in 1 minute
app.use((req, res, next) => {
  requestsQuota--;
  next();
});

const resetRequestQuota = new CronJob("* * * * *", function() {
  requestsQuota = 75;
});
resetRequestQuota.start();

// for update rank once a week, on thursday
// Thanks https://crontab.guru/examples.html
const updateRankJob = new CronJob("0 0 * * */4", function() {
  const reset = require("/app/src/reset");
  reset.usersPoint();
});
updateRankJob.start();

app.use("/callback", line.middleware(config));

app.get("/", (req, res) => res.sendStatus(200));

app.post("/callback", (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(err => {
      console.error("error di app.post", err);
    });
});

function sendLimitResponse(event) {
  let date = new Date();
  let remainingSeconds = 60 - date.getSeconds();
  let text = "💡 Maaf, server sedang macet. Mohon tunggu ";
  text += remainingSeconds + " detik lagi";
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: text
  });
}

function checkGroupSession(event) {
  const data = require("/app/src/data");
  let eventType = event.source.type;

  if (eventType === "group" || eventType === "room") {
    let groupId =
      eventType === "group" ? event.source.groupId : event.source.roomId;
    data.pauseTime(groupId);
  }
}

async function handleEvent(event) {
  //Note: should return! So Promise.all could catch the error
  if (event.type === "postback") {
    if (requestsQuota <= 0) {
      return sendLimitResponse(event);
    }

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

  let rawArgs = event.message.text;
  if (requestsQuota <= 0 && rawArgs.startsWith("/")) {
    return sendLimitResponse(event);
  }

  const data = require("/app/src/data");
  return data.receive(client, event, rawArgs);
}

// listen for requests :)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Your app is listening on port " + port);
});
