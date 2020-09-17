const getData = () => {
  const data = {
    name: "godfather",
    description: "Kamu adalah ketua Mafia. Kamu kebal dari serangan biasa dan tidak bersalah jika di cek Sheriff",
    skillText: "Godfather, pilih siapa yang ingin dibunuh",
    cmdText: "/skill",
    team: "mafia",
    canKill: true,
    emoji: {
      team: "🤵",
      self: "🚬"
    },
    type: "Mafia Killing",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/cigarette_1f6ac.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Ketua geng Mafia, yang biasanya berkelompok. ";
  text += "Jika ada Mafioso, maka yang membunuh adalah Mafioso. Godfather kebal dari serangan biasa. ";
  text += "Jika Mafioso di block atau tidak ada, Godfather lah yang akan membunuh target";

  return text;
};

const botSkillAction = (util, group_session, botIndex) => {
  const players = group_session.players;
  let targets = players
    .map((item, index) => {
      if (item.id !== players[botIndex].id && item.status === "alive" && item.role.team !== "mafia") {
        return index;
      }
    })
    .filter(item => {
      return item !== undefined;
    });

  targets = util.shuffleArray(targets);

  group_session.players[botIndex].target.index = targets[0];
  group_session.players[botIndex].target.value++;
};

module.exports = {
  getData,
  getInfo,
  botSkillAction
};
