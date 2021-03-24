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
  const info = {
    summary:
      "Mantan tentara yang membantu melindungi seseorang dari serangan langsung pada malam hari. Jika targetnya diserang, maka Bodyguard akan melawan balik penyerang tersebut.",
    goal: "Menghukum semua kriminal dan penjahat"
  };
  return info;
};

module.exports = { getData, getInfo };
