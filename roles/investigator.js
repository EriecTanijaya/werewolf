const getData = () => {
  const data = {
    name: "investigator",
    description: "Kamu adalah warga yang bisa cek identitas seorang warga. ",
    skillText: "Investigator, pilih siapa yang ingin di check",
    team: "villager",
    cmdText: "/skill",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "🕵️"
    },
    type: "Town Investigate",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/detective_1f575.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Warga yang bisa menginvestigasi seorang warga pada malam hari. ";
  text += "Jika target mu Disguiser, dan Disguiser mengimitasi orang lain, hasil cek mu adalah ";
  text += "role dari imitasi Disguiser. Untuk melihat hasil cek Investigator bisa dengan '/info note invest'";
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
