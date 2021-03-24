const getData = () => {
  const data = {
    name: "consigliere",
    description: "Kamu di pihak Mafia, dan bisa mengecek role seorang warga",
    skillText: "Consigliere, pilih siapa yang ingin dicek",
    cmdText: "/skill",
    team: "mafia",
    canKill: false,
    emoji: {
      team: "🤵",
      self: "✒️"
    },
    type: "Mafia Support",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/black-nib_2712.png"
  };
  return data;
};

const getInfo = () => {
  const info = {
    summary:
      "Investigator korup yang membantu mengumpulkan informasi bagi Mafia. Setiap malam dapat mengecek role asli dari salah satu warga.",
    goal: "Menyingkirkan semua warga yang menentang Mafia"
  };
  return info;
};

module.exports = { getData, getInfo };
