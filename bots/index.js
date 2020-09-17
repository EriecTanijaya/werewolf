const util = require("../util");

const bot_investigator = (players, justDead, bot) => {
  const accusedRole = bot.claimedRole.accusedRole;
  const result = util.getInvestigatorResult(accusedRole);
  const targetName = players[bot.claimedRole.targetIndex].name;
  let text = `Cek ${targetName}\n${result}`;
  return text;
};

const bot_lookout = (players, justDead, bot) => {
  const targetName = players[bot.claimedRole.targetIndex].name;
  const randomDead = util.random(justDead);
  let text = "Rumah " + randomDead + " dikunjungi " + targetName + " semalam";
  return text;
};

const bot_sheriff = (players, justDead, bot) => {
  const targetName = players[bot.claimedRole.targetIndex].name;
  let text = targetName + " mencurigakan";
  return text;
};

const bot_tracker = (players, justDead, bot) => {
  const targetName = players[bot.claimedRole.targetIndex].name;
  const randomDead = util.random(justDead);
  let text = targetName + " ke rumah " + randomDead;
  return text;
};

module.exports = {
  bot_investigator,
  bot_lookout,
  bot_sheriff,
  bot_tracker
};
