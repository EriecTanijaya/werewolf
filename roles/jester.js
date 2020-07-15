const getData = () => {
  const data = {
    name: "jester",
    description:
      "Kamu menang jika berhasil digantung. Dan bisa bunuh siapa saja disaat sudah mati",
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
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/clown-face_1f921.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Jester menang jika dia berhasil digantung. ";
  text += "Jika berhasil digantung, dia bisa membalas kematiannya ";
  text += "dengan menghantui orang lain sampai mati. ";
  text += "Target yang dihantui Jester tidak dapat diselamatkan oleh apapun. ";
  return text;
};

module.exports = {
  getData,
  getInfo
};
