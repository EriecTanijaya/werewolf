const getData = () => {
  const data = {
    name: "spy",
    description:
      "Kamu adalah warga yang bisa mengetahui siapa saja yang dikunjungi Mafia saat malam dan menyadap suatu orang",
    skillText: "Spy, pilih siapa yang mau kamu sadap",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "🔍"
    },
    type: "Town Investigate",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/magnifying-glass-tilted-left_1f50d.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Warga yang bisa menyadap suatu pemain saat malam. Spy bisa tahu apa yang terjadi pada Targetnya. ";
  text += "Spy juga bisa tahu Mafia ke rumah siapa saja saat malam. ";
  return text;
};

const botSkillAction = (util, group_session, botIndex) => {
  const players = group_session.players;
  let targets = players
    .map((item, index) => {
      if (item.id !== players[botIndex].id && item.status === "alive") {
        return index;
      }
    })
    .filter(item => {
      return item !== undefined;
    });

  targets = util.shuffleArray(targets);

  group_session.players[botIndex].target.index = targets[0];
};

module.exports = {
  getData,
  getInfo,
  botSkillAction
};
