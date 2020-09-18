const getData = () => {
  const data = {
    name: "bodyguard",
    description:
      "Kamu adalah warga yang bisa melindungi seseorang saat malam, dan menyerang kembali penyerang targetmu. ",
    skillText: "Bodyguard, pilih siapa yang mau kamu lindungi",
    cmdText: "/skill",
    team: "villager",
    canKill: true,
    emoji: {
      team: "👨‍🌾",
      self: "🛡️"
    },
    type: "Town Protector",
    vest: 1,
    counterAttackIndex: -1,
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/shield_1f6e1.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Warga yang bisa memilih siapa pemain yang ingin dilindungi. ";
  text += "Jika Target Bodyguard mau diserang, maka Bodyguard akan melawan balik penyerang tersebut, ";
  text += "dan penyerang itu akan balik menyerang Bodyguard dan mengabaikan target awalnya. ";
  text += "Bodyguard memiliki 1 vest yang bisa digunakan untuk melindungi diri sendiri dari serangan biasa. ";
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

  const what = util.random(["self", "other"]);

  if (players[botIndex].role.vest > 0 && what === "self") {
    group_session.players[botIndex].target.index = botIndex;
  } else {
    group_session.players[botIndex].target.index = targets[0];
  }
};

module.exports = {
  getData,
  getInfo,
  botSkillAction
};
