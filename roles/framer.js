const getData = () => {
  const data = {
    name: "framer",
    description:
      "Kamu adalah anggota Mafia yang bisa menjebak seorang warga pada malam hari agar warga tersebut terlihat bersalah jika di cek",
    skillText: "Framer, pilih siapa yang mau dijebak",
    cmdText: "/skill",
    team: "mafia",
    canKill: false,
    emoji: {
      team: "🤵",
      self: "🎞️"
    },
    type: "Mafia Deception",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/film-frames_1f39e.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Anggota Mafia yang bisa membuat suatu pemain tampak bersalah. ";
  text += "Jika Target Framer di cek Sheriff, maka akan tampak bersalah walaupun ia adalah warga. ";
  return text;
};

module.exports = {
  getData,
  getInfo
};
