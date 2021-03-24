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
  const info = {
    summary:
      "Seorang warga yang diam-diam mengumpulkan informasi. Investigator dapat mengecek seseorang pada malam hari untuk mendapatkan petunjuk tentang role orang tersebut.",
    goal: "Menghukum semua kriminal dan penjahat"
  };
  return info;
};

module.exports = { getData, getInfo };
