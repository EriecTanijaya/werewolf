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
  const info = {
    summary:
      "Penari cantik yang bekerja untuk Mafia. Consort dapat mengganggu perhatian dari target, sehingga dapat block skill dari seorang warga.",
    goal: "Menyingkirkan semua warga yang menentang Mafia"
  };
  return info;
};

module.exports = { getData, getInfo };
