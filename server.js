const line = require("@line/bot-sdk");
const express = require("express");
const app = express();

// initialize module
const data = require("./src/data");
const other = require("./src/other");

// line config
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

/// measure request time
// Thanks to https://slao.io/blog/posts/request-duration/
const getDurationInMilliseconds = start => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

app.use((req, res, next) => {
  if (process.env.TEST === "true")
    console.log(`${req.method} ${req.originalUrl} [STARTED]`);

  const start = process.hrtime();

  res.on("finish", () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    let text = `${req.method} ${req.originalUrl} [FINISHED] `;
    text += `${durationInMilliseconds.toLocaleString()} ms`;
    if (process.env.TEST === "true") console.log(text);
  });

  res.on("close", () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    let text = `${req.method} ${req.originalUrl} [CLOSED] `;
    text += `${durationInMilliseconds.toLocaleString()} ms`;
    if (process.env.TEST === "true") console.log(text);
  });

  next();
});

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
    let otherEvents = ["join", "follow", "memberJoined"];
    if (otherEvents.includes(event.type)) {
      return other.receive(event);
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
