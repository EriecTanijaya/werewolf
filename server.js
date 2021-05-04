const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
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

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  //Check if work id is died
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log(`Let's fork another worker!`);
    cluster.fork();
  });
} else {
  // This is Workers can share any TCP connection
  // It will be initialized using express
  console.log(`Worker ${process.pid} started`);

  app.get("/", (req, res) => res.sendStatus(200));

  app.post("/callback", line.middleware(config), (req, res) => {
    Promise.all(req.body.events.map(handleEvent))
      .then(() => res.end())
      .catch(err => {
        console.error("error di app.post", err);
        res.status(500).end();
      });
  });

  async function handleEvent(event) {
    //Note: should return! So Promise.all could catch the error
    if (event.type === "postback") {
      return data.receive(event, event.postback.data);
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

    return data.receive(event, event.message.text);
  }

  // listen for requests :)
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log("Your app is listening on port " + port);
  });
}
