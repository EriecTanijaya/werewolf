const getData = () => {
  const data = {
    name: "lookout",
    description:
      "Kamu adalah warga yang bisa memantau rumah seseorang pas malam, sehingga bisa mengetahui siapa pendatangnya",
    skillText: "Lookout, pilih rumah yang ingin dipantau",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "👀"
    },
    type: "Town Investigate",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/eyes_1f440.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Warga yang bisa memilih rumah siapa yang ingin dipantau pas malam. ";
  text += "Lookout bisa mengetahui siapa saja pendatang rumah dari target yang dipantau. ";
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
