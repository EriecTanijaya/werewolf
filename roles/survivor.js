const getData = () => {
  const data = {
    name: "survivor",
    description:
      "Kamu bisa berpihak dengan siapa saja, asalkan kamu tidak mati. Jika kamu hidup hingga akhir game, kamu menang",
    skillText: "Survivor, apakah kamu akan gunakan vest malam ini?",
    cmdText: "/vest",
    team: "survivor",
    canKill: false,
    emoji: {
      team: "🏳️",
      self: "🏳️"
    },
    vest: 4,
    type: "Neutral",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/white-flag_1f3f3.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Orang yang bisa menang dengan siapa saja, asalkan dia tidak mati hingga akhir game. ";
  text += "Survivor dibekali 4 vest untuk melindungi diri dari serangan biasa. ";
  return text;
};

const botSkillAction = (util, group_session, botIndex) => {
  if (group_session.players[botIndex].role.vest === 0) {
    return;
  }

  const what = util.random(["self", "nah", "self"]);

  if (what === "nah") return;

  group_session.players[botIndex].target.index = botIndex;
};

module.exports = {
  getData,
  getInfo,
  botSkillAction
};
