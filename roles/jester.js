const getData = () => {
  const data = {
    name: "jester",
    description:
      "Kamu menang jika berhasil dihukum lewat voting. Jika kamu telah di hukum, kamu bisa memilih salah satu orang yang telah vote kamu untuk dihantui",
    team: "jester",
    skillText: "Jester, pilih siapa yang ingin dihantui",
    cmdText: "/skill",
    canKill: false,
    emoji: {
      team: "🤡",
      self: "🤡"
    },
    isLynched: false,
    hasRevenged: false,
    type: "Neutral",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/clown-face_1f921.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Jester menang jika dia berhasil digantung. ";
  text += "Jika berhasil digantung, dia bisa membalas kematiannya ";
  text += "dengan menghantui orang yang vote dia. ";
  text += "Target yang dihantui Jester tidak dapat diselamatkan oleh apapun. ";
  return text;
};

const botSkillAction = () => {
  return;
};

module.exports = {
  getData,
  getInfo,
  botSkillAction
};
