const getData = () => {
  const data = {
    name: "escort",
    description:
      "Kamu adalah warga yang bisa block skill pemain lain, sehingga targetmu tidak dapat menggunakan skill malamnya. Hati hati, kamu bisa block skill sesama warga",
    skillText: "Escort, pilih siapa yang mau kamu distrak malam ini",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "💋"
    },
    type: "Town Support",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/kiss-mark_1f48b.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Warga yang bisa block skill orang lain, sehingga targetnya tidak bisa menggunakan skillnya. ";
  text +=
    "Namun jika ke rumah Serial Killer, Escort ini bisa dibunuhnya dan Serial Killer akan mengabaikan target awalnya. ";
  text += "Escort juga immune dari role block. ";
  return text;
};

module.exports = {
  getData,
  getInfo
};
