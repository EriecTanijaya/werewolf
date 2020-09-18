const getData = () => {
  const data = {
    name: "retributionist",
    description: "Kamu adalah warga yang bisa membangkitkan orang yang telah mati. ",
    skillText: "Retributionist, pilih siapa yang mau kamu bangkitkan",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "⚰️"
    },
    revive: 1,
    type: "Town Support",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/coffin_26b0.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Warga yang bisa membangkitkan orang yang sudah mati. Namun kesempatan ini hanya 1 kali saja. ";
  return text;
};

const botSkillAction = (util, group_session, botIndex) => {
  const players = group_session.players;
  if (players[botIndex].role.revive === 0) {
    return;
  }

  let targets = players
    .map((item, index) => {
      if (item.id !== players[botIndex].id && item.status === "death") {
        if (item.role.team === "villager") {
          return index;
        } else if (util.isDisguiseAsTownie(item)) {
          return index;
        }
      }
    })
    .filter(item => {
      return item !== undefined;
    });

  if (targets.length === 0) return;

  targets = util.shuffleArray(targets);

  group_session.players[botIndex].target.index = targets[0];
};

module.exports = {
  getData,
  getInfo,
  botSkillAction
};
