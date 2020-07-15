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
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/black-nib_2712.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Bisa mengecek suatu pemain untuk di ketahui role nya. Consigliere akan berubah menjadi Mafioso jika ";
  text += "sudah tidak ada Mafia Killing";
  return text;
};

module.exports = {
  getData,
  getInfo
};
