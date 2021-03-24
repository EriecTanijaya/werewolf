const getData = () => {
  const data = {
    name: "disguiser",
    description:
      "Kamu adalah anggota Mafia yang bisa mengimitasi nama role seorang warga, dan jika mati yang terlihat role mu adalah role yang kamu imitasi",
    skillText: "Disguiser, pilih siapa yang mau imitasi",
    cmdText: "/skill",
    team: "mafia",
    canKill: false,
    emoji: {
      team: "🤵",
      self: "🎭"
    },
    type: "Mafia Deception",
    disguiseAs: "",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/performing-arts_1f3ad.png"
  };
  return data;
};

const getInfo = () => {
  const info = {
    summary: "Anggota Mafia yang dapat menyamar menjadi warga yang non Mafia pada saat di cek Investigator.",
    goal: "Menyingkirkan semua warga yang menentang Mafia"
  };
  return info;
};

module.exports = { getData, getInfo };
