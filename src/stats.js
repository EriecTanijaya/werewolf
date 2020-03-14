const fs = require("fs");

const baseUserPath = "/app/.data/users/";
const baseGroupPath = "/app/.data/groups/";

// const datas = require("/app/src/data");

module.exports = {
  receive: function(client, event, args) {
    this.client = client;
    this.event = event;
    this.args = args;

    let user_session = {};

    let userPath = baseUserPath + this.event.source.userId + "_user.json";

    fs.readFile(userPath, "utf8", (err, data) => {
      if (err) return this.replyText("💡 Belum ada data usernya");
      user_session = JSON.parse(data);
      this.commandHandler(user_session);
    });
  },

  commandHandler: function(user_session) {
    switch (this.args[0]) {
      case "/me":
      case "/stats":
      case "/stat":
        return this.meCommand(user_session);
      case "/rank":
        return this.rankCommand();
      case "/status":
        // game online ada berapa
        return this.statusCommand();
      case "/reset":
        return this.resetAllCommand();
    }
  },

  resetAllCommand: function() {
    console.log("asda");
    if (this.event.source.userId !== process.env.DEV_ID) {
      return Promise.resolve(null);
    }
    this.resetUserCommand();
  },

  resetUserCommand: function() {
    fs.readdirSync(baseUserPath).forEach(item => {
      if (item.includes("user")) {
        let data = fs.readFileSync(baseUserPath + item);
        let rawUser = JSON.parse(data);

        rawUser.state = "inactive";
        rawUser.groupId = "";

        this.saveUserData(rawUser);
      }
    });
    this.resetGroupCommand();
  },

  resetGroupCommand: function() {
    fs.readdirSync(baseGroupPath).forEach(item => {
      if (item.includes("group")) {
        let data = fs.readFileSync(baseGroupPath + item);
        let rawGroup = JSON.parse(data);

        rawGroup.state = "idle";
        rawGroup.time = 0;

        this.resetAllPlayers(rawGroup.players);

        this.saveGroupData(rawGroup);
      }
    });
    return this.replyText("users and group data reseted");
  },

  meCommand: function(user_session) {
    let team = this.args[1];

    let stats = {
      villager: user_session.villagerStats,
      werewolf: user_session.werewolfStats,
      vampire: user_session.vampireStats,
      tanner: user_session.tannerStats,
      serialKiller: user_session.serialKillerStats,
      arsonist: user_session.arsonistStats
    };

    let flex_text = {
      header: {
        text: "🏆 " + user_session.name
      },
      body: {
        text: ""
      }
    };

    let totalGame = 0;
    let winRate = 0;

    let result = this.calculateWinLose(team, stats);

    let whatStat = " Summary Stat";
    if (team) {
      whatStat = " " + team.toUpperCase() + " Stat";
    }

    totalGame = result.win + result.lose;
    winRate = Math.floor((result.win / totalGame) * 100);
    if (isNaN(winRate)) {
      winRate = 0;
    }

    let text = "📊 WR : " + winRate + "%" + "\n";
    text += "⭐ Points : " + result.points + "\n";
    text += "🎮 Game : " + totalGame;

    flex_text.header.text += "\n" + whatStat;
    flex_text.body.text += text;

    return this.replyFlex(flex_text);
  },

  rankCommand: function() {
    let headerText = "🏆 ";
    let team = this.args[1];
    let availableTeam = [
      "villager",
      "werewolf",
      "tanner",
      "serial-killer",
      "arsonist",
      "vampire"
    ];
    if (this.args[1] && !availableTeam.includes(team)) {
      let text =
        "💡 Tidak ada team " +
        team +
        ", team yang ada : " +
        availableTeam.join(", ");
      return this.replyText(text);
    }

    let whatStat = " Global Rank";
    if (team) {
      whatStat = team.toUpperCase() + " Rank";
    }
    headerText += whatStat;

    let users = fs
      .readdirSync(baseUserPath)
      .filter(u => {
        if (!u.includes("user")) {
          return false;
        }
        return true;
      })
      .map((item, index) => {
        let data = fs.readFileSync(baseUserPath + item);
        let rawUser = JSON.parse(data);

        let totalGame = 0;
        let winRate = 0;

        let stats = {
          villager: rawUser.villagerStats,
          werewolf: rawUser.werewolfStats,
          vampire: rawUser.vampireStats,
          tanner: rawUser.tannerStats,
          serialKiller: rawUser.serialKillerStats,
          arsonist: rawUser.arsonistStats
        };

        let result = this.calculateWinLose(team, stats);

        // rawUser.points = result.points;
        // datas.saveUserData(rawUser);

        totalGame = result.win + result.lose;
        winRate = Math.floor((result.win / totalGame) * 100);
        if (isNaN(winRate)) {
          winRate = 0;
        }

        let user = {
          name: rawUser.name,
          points: result.points,
          totalGame: totalGame,
          winRate: winRate + "%"
        };

        return user;
      });

    if (users.length === 0) {
      return this.replyText("💡 Belum ada data usernya");
    }

    users = this.rank_sort(users);

    users.length = 10;

    let flex_text = this.getTableFlex(users, headerText, team);

    return this.replyFlex(flex_text);
  },

  statusCommand: function() {
    let usersOnlineCount = 0;
    let groupsOnlineCount = 0;

    fs.readdirSync(baseUserPath).forEach(item => {
      if (item.includes("user")) {
        let data = fs.readFileSync(baseUserPath + item);
        let rawUser = JSON.parse(data);

        if (rawUser.state === "active") {
          usersOnlineCount++;
        }
      }
    });

    fs.readdirSync(baseGroupPath).forEach(item => {
      if (item.includes("group")) {
        let data = fs.readFileSync(baseGroupPath + item);
        let rawGroup = JSON.parse(data);

        if (rawGroup.state !== "idle") {
          groupsOnlineCount++;
        }
      }
    });

    let statusText = "";

    let userText = "";
    if (usersOnlineCount) {
      userText = "Ada " + usersOnlineCount + " user(s) sedang online";
    } else {
      userText = "Semua user sedang offline";
    }

    let groupText = "";
    if (groupsOnlineCount) {
      groupText = "Ada " + groupsOnlineCount + " group(s) sedang online";
    } else {
      groupText = "Semua group sedang offline";
    }

    if (!groupsOnlineCount && !usersOnlineCount) {
      statusText = "Server nganggur, gak ada yang online";
    } else {
      statusText = userText + "\n\n" + groupText;
    }

    let flex_text = {
      header: {
        text: "🌐 Status"
      },
      body: {
        text: statusText
      }
    };
    return this.replyFlex(flex_text);
  },

  /* Helper Func */

  rank_sort: function(array) {
    //Thanks to
    //https://coderwall.com/p/ebqhca/javascript-sort-by-two-fields

    // descending
    return array.sort((person1, person2) => {
      let person1_winRate = person1.winRate.match(/\d+/);
      let person2_winRate = person2.winRate.match(/\d+/);
      return (
        person2.points - person1.points || person2_winRate - person1_winRate
      );
    });
  },

  calculateWinLose: function(team, stats) {
    let win = 0;
    let lose = 0;
    switch (team) {
      case "villager":
        win = stats.villager.win;
        lose = stats.villager.lose;
        break;

      case "werewolf":
        win = stats.werewolf.win;
        lose = stats.werewolf.lose;
        break;

      case "tanner":
        win = stats.tanner.win;
        lose = stats.tanner.lose;
        break;

      case "vampire":
        win = stats.vampire.win;
        lose = stats.vampire.lose;
        break;

      case "serial-killer":
        win = stats.serialKiller.win;
        lose = stats.serialKiller.lose;
        break;

      case "arsonist":
        win = stats.arsonist.win;
        lose = stats.arsonist.lose;
        break;

      default:
        /// calculate total all game play,
        // calculate all win & lose from each team
        Object.keys(stats).forEach(key => {
          let stat = stats[key];
          win += stat.win;
          lose += stat.lose;
        });
    }

    let points = win * 5 + lose * 1;

    let result = {
      win: win,
      lose: lose,
      points: points
    };
    return result;
  },

  getTableFlex: function(users, headerText, team) {
    let flex_text = {
      header: {
        text: headerText
      }
    };

    flex_text.table = {
      header: {
        addon: "Win Rate"
      },
      body: []
    };

    let table_body = {};

    let num = 1;
    users.forEach((item, index) => {
      table_body[index] = {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "text",
            text: ""
          },
          {
            type: "text",
            text: "",
            flex: 3
          },
          {
            type: "text",
            text: "",
            flex: 2,
            align: "center"
          },
          {
            type: "text",
            text: "",
            flex: 2,
            align: "center",
            wrap: true
          }
        ],
        margin: "sm"
      };

      table_body[index].contents[0].text += num + ".";
      table_body[index].contents[1].text += item.name;
      table_body[index].contents[2].text += item.points;
      table_body[index].contents[3].text += item.winRate;

      num++;

      flex_text.table.body.push(table_body[index]);
    });

    return flex_text;
  },

  /* Data Func */

  resetAllPlayers: function(players) {
    const data = require("/app/src/data");
    data.resetAllPlayers(players);
  },

  saveGroupData: function(group_session) {
    let groupData = {
      groupId: group_session.groupId,
      state: group_session.state,
      status: group_session.status,
      players: group_session.players
    };

    const data = require("/app/src/data");
    data.saveGroupData(groupData);
  },

  saveUserData: function(raw_user_session) {
    const baseUserPath = "/app/.data/users/";
    let userPath = baseUserPath + raw_user_session.id + "_user.json";
    let user_session = {};
    fs.readFile(userPath, "utf8", (err, data) => {
      if (err) {
        user_session = raw_user_session;
      } else {
        user_session = JSON.parse(data);
      }
      this.updateUserData(user_session, raw_user_session);
    });
  },

  updateUserData: function(oldUserData, newUserData) {
    oldUserData.state = newUserData.state;
    oldUserData.groupId = newUserData.groupId;

    const data = require("/app/src/data");
    data.saveUserData(oldUserData);
  },

  /* Message Func */

  replyFlex: function(flex_raws, text_raws, newFlex_raws) {
    flex_raws = Array.isArray(flex_raws) ? flex_raws : [flex_raws];
    let flex_texts = flex_raws.map(flex_raw => ({
      header: flex_raw.header,
      body: flex_raw.body,
      footer: flex_raw.footer,
      table: flex_raw.table
    }));

    let opt_texts = [];
    if (text_raws) {
      text_raws = Array.isArray(text_raws) ? text_raws : [text_raws];
      opt_texts = text_raws.map(text => {
        return { type: "text", text: text };
      });
    }

    let newFlex_texts = null;
    if (newFlex_raws) {
      newFlex_raws = Array.isArray(newFlex_raws)
        ? newFlex_raws
        : [newFlex_raws];
      newFlex_texts = newFlex_raws.map(newFlex_raw => ({
        header: newFlex_raw.header,
        body: newFlex_raw.body,
        footer: newFlex_raw.footer,
        table: newFlex_raw.table
      }));
    }

    const flex = require("/app/message/flex");
    return flex.receive(
      this.client,
      this.event,
      flex_texts,
      opt_texts,
      newFlex_texts,
      "stat"
    );
  },

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];

    return this.client
      .replyMessage(
        this.event.replyToken,
        texts.map(text => ({ type: "text", text: text.trim() }))
      )
      .catch(err => {
        console.log(err.originalError.response.data);
      });
  }
};
