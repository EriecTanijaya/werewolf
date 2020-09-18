const util = require("../util");

const bot_investigator = (players, justDeadIndexes, bot) => {
  const accusedRole = bot.claimedRole.accusedRole;
  const result = util.getInvestigatorResult(accusedRole);
  const targetName = players[bot.claimedRole.targetIndex].name;
  let text = `Cek ${targetName}\n${result}`;
  return text;
};

const bot_lookout = (players, justDeadIndexes, bot) => {
  const targetName = players[bot.claimedRole.targetIndex].name;
  const randomDeadIndex = util.random(justDeadIndexes);
  let text = "Rumah " + players[justDeadIndexes].name + " dikunjungi " + targetName + " semalam";
  return text;
};

const bot_sheriff = (players, justDeadIndexes, bot) => {
  const targetName = players[bot.claimedRole.targetIndex].name;
  let text = targetName + " mencurigakan";
  return text;
};

const bot_tracker = (players, justDeadIndexes, bot) => {
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
