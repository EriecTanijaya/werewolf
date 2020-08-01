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

module.exports = {
  getData,
  getInfo
};
