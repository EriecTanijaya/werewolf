const util = require("../util");

const bot_investigator = (players, justDeadIndexes, bot) => {
  const accusedRole = bot.claimedRole.accusedRole;
  const result = util.getInvestigatorResult(accusedRole);
  const targetName = players[bot.claimedRole.targetIndex].name;
  let text = `Cek ${targetName}\n${result}`;
  return text;
};

const bot_lookout = (players, justDeadIndexes, bot) => {
  if (justDeadIndexes.length === 0) {
    const alivePlayersName = players
      .map((item, index) => {
        if (item.id !== bot.id && item.status === "alive") {
          return item.name;
        }
      })
      .filter(item => {
        return item !== undefined;
      });

    const randomName = util.random(alivePlayersName);
    let text = "Rumah " + randomName + " tidak didatangi siapa siapa";
    return text;
  }

  const targetName = players[bot.claimedRole.targetIndex].name;
  const randomDeadIndex = util.random(justDeadIndexes);
  let text = "Rumah " + players[randomDeadIndex].name + " dikunjungi " + targetName + " semalam";
  return text;
};

const bot_sheriff = (players, justDeadIndexes, bot) => {
  const targetName = players[bot.claimedRole.targetIndex].name;
  let text = targetName + " mencurigakan";
  return text;
};

const bot_tracker = (players, justDeadIndexes, bot) => {
  if (justDeadIndexes.length === 0) {
    const alivePlayersName = players
      .map((item, index) => {
        if (item.id !== bot.id && item.status === "alive") {
          return item.name;
        }
      })
      .filter(item => {
        return item !== undefined;
      });

    const randomName = util.random(alivePlayersName);
    let text = randomName + " diam di rumah saja";
    return text;
  }

  const targetName = players[bot.claimedRole.targetIndex].name;
  const randomDeadIndex = util.random(justDeadIndexes);
  let text = targetName + " ke rumah " + players[randomDeadIndex].name;
  return text;
};

module.exports = {
  bot_investigator,
  bot_lookout,
  bot_sheriff,
  bot_tracker
};
