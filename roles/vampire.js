const getData = () => {
  const data = {
    name: "vampire",
    description:
      "Kamu adalah makhluk yang bisa mengubah warga menjadi Vampire, misimu mengubah semua warga menjadi Vampire",
    skillText: "Vampire, pilih siapa yang ingin di ubah menjadi vampire",
    team: "vampire",
    cmdText: "/skill",
    canKill: true,
    emoji: {
      team: "🧛",
      self: "🧛"
    },
    age: 0,
    type: "Neutral Chaos",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/vampire_1f9db.png"
  };
  return data;
};

const getInfo = () => {
  let text =
    "Makhluk hidup yang membawa kerusuhan dengan bisa mengubah warga menjadi sejenisnya. ";
  text +=
    "Vampire jika berhasil mengubah seoranga warga menjadi Vampire, akan ada jeda untuk ";
  text += "menggigit target selanjutnya. ";
  text +=
    "Jika jumlah Vampire sudah 4 atau lebih, maka Vampire tidak lagi mengubah seorang warga ";
  text += "warga menjadi Vampire, tetapi menyerangnya. ";
  text += "Vampire tidak bisa gigit role yang bisa kebal dari serangan biasa. ";
  return text;
};

module.exports = {
  getData,
  getInfo
};
