const getData = () => {
  const data = {
    name: "consort",
    description: "Kamu di pihak Mafia dan bisa block skill suatu pemain saat malam.",
    skillText: "Consort, Pilih siapa yang ingin di block",
    cmdText: "/skill",
    team: "mafia",
    canKill: false,
    emoji: {
      team: "🤵",
      self: "🚷"
    },
    type: "Mafia Support",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/no-pedestrians_1f6b7.png"
  };
  return data;
};

const getInfo = () => {
  let text =
    "Bisa block skill suatu pemain. Namun jika Consort nge block Serial Killer, maka Serial Killer akan menyerang Consort ";
  text += "dan mengabaikan target awalnya. Consort immune dari blocknya Escort. Consort akan berubah menjadi Mafioso ";
  text += "jika sudah tidak ada Mafia Killing";
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
};

module.exports = {
  getData,
  getInfo,
  botSkillAction
};
