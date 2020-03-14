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

const getDurationInMilliseconds = start => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} [STARTED]`);
  const start = process.hrtime();

  res.on("finish", () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    console.log(
      `${req.method} ${
        req.originalUrl
      } [FINISHED] ${durationInMilliseconds.toLocaleString()} ms`
    );
  });

  res.on("close", () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    console.log(
      `${req.method} ${
        req.originalUrl
      } [CLOSED] ${durationInMilliseconds.toLocaleString()} ms`
    );
  });

  next();
});

// send response immediately
app.get("/fast/", (req, res) => {
  res.sendStatus(200);
});

// mock heavy load, send response after 10 seconds
app.get("/slow/", (req, res) => {
  setTimeout(() => res.sendStatus(200), 10 * 1000);
});

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
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Your app is listening on port " + port);
});
