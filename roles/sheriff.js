const getData = () => {
  const data = {
    name: "sheriff",
    description: "Kamu adalah penegak hukum yang bisa cek suatu warga mencurigakan atau tidak.",
    skillText: "Sheriff, pilih siapa yang mau kamu cek",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "👮"
    },
    type: "Town Investigate",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/police-officer_1f46e.png"
  };
  return data;
};

const getInfo = () => {
  const info = {
    summary:
      "Penegak hukum yang terpaksa menyembunyikan identitasnya dari ancaman pembunuhan. Sheriff dapat mengecek aktivitas mencurigkan dari seseorang warga tiap malam.",
    goal: "Menghukum semua kriminal dan penjahat"
  };
  return info;
};

module.exports = { getData, getInfo };
