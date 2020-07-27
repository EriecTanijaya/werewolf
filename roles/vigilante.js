const getData = () => {
  const data = {
    name: "vigilante",
    description:
      "Kamu adalah warga yang bisa memilih siapa yang ingin dibunuh pas malam. Jika kamu bunuh sesama warga, kamu akan bunuh diri keesokan harinya",
    skillText: "Vigilante, pilih siapa yang ingin dibunuh",
    cmdText: "/skill",
    team: "villager",
    canKill: true,
    emoji: {
      team: "👨‍🌾",
      self: "🔫"
    },
    isLoadBullet: true,
    bullet: 3,
    type: "Town Killing",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/pistol_1f52b.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Warga yang bisa menyerang orang lain saat malam. ";
  text += "Tetapi jika dia membunuh sesama warga, dia akan bunuh diri keesokan harinya. ";
  text += "Vigilante harus menunggu satu malam untuk menyiapkan senjatanya dan baru bisa menggunakan skill ";
  text += "keesokkan harinya. ";
  return text;
};

module.exports = {
  getData,
  getInfo
};
