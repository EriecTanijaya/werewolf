const getData = () => {
  const data = {
    name: "amnesiac",
    description:
      "Kamu adalah orang yang lupa dengan role mu sendiri. Untuk mengingat role, bisa dengan pilih dari salah orang yang telah mati",
    skillText: "Amnesiac, pilih siapa yang mau kamu ingat rolenya",
    cmdText: "/skill",
    team: "amnesiac",
    canKill: false,
    emoji: {
      team: "🤕",
      self: "🤕"
    },
    type: "Neutral",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/face-with-head-bandage_1f915.png"
  };
  return data;
};

const getInfo = () => {
  let text =
    "Orang yang lupa dengan siapa dirinya. Dapat mengingat siapa dirinya dengan memilih orang yang telah mati. ";
  text += "Jika Amnesiac telah ingat role nya, maka akan di beritahu secara publik. ";
  text += "Jika Amnesiac mengingat seorang Disguiser yang sedang mengimitasi, maka dia akan menjadi Disguiser.";
  return text;
};

const botSkillAction = (util, group_session, botIndex) => {
  const players = group_session.players;
  let targets = players
    .map((item, index) => {
      if (item.id !== players[botIndex].id && item.status === "death") {
        return index;
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
