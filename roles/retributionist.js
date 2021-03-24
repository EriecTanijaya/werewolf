const getData = () => {
  const data = {
    name: "retributionist",
    description: "Kamu adalah warga yang bisa membangkitkan orang yang telah mati. ",
    skillText: "Retributionist, pilih siapa yang mau kamu bangkitkan",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "⚰️"
    },
    revive: 1,
    type: "Town Support",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/coffin_26b0.png"
  };
  return data;
};

const getInfo = () => {
  const info = {
    summary: "Warga yang memiliki kekuatan mistik untuk membangkitkan orang yang telah mati dalam 1 kali kesempatan.",
    goal: "Menghukum semua kriminal dan penjahat"
  };
  return info;
};

module.exports = { getData, getInfo };
