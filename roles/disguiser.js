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
  let text = "Anggota Mafia yang bisa meniru nama role seorang warga. ";
  text += "Jika Disguiser mati, maka nama role yang ada di daftar pemain adalah nama role warga yang dia imitasi. ";
  text +=
    "Hasil cek Sheriff akan tetap mencurigakan, sedangkan Investigator hasil terawangnya adalah role yang di imitasi. ";
  text += "Orang yang di imitasi Disguiser tidak tahu jika dirinya di imitasi. ";
  return text;
};

module.exports = {
  getData,
  getInfo
};
