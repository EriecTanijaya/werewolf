const getData = () => {
  const data = {
    name: "juggernaut",
    description: "Kamu adalah kriminal yang akan semakin kuat jika membunuh orang",
    skillText: "Juggernaut, pilih siapa yang mau kamu bunuh",
    cmdText: "/skill",
    team: "juggernaut",
    canKill: true,
    emoji: {
      team: "💪",
      self: "💪"
    },
    type: "Neutral Killing",
    skillLevel: 0,
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/flexed-biceps_1f4aa.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Seorang kriminal yang kekuatannya makin bertambah tiap kali ia berhasil membunuh. ";
  text += "Jika berhasil membunuh sekali, dia bisa serang tiap malam. ";
  text += "Kedua kali, bisa kebal dari serangan biasa. ";
  text += "Ketiga kali, bisa juga menyerang orang yang kerumah Targetnya. ";
  text += "Keempat kali, serangannya menembus perlindungan biasa. Tapi Bodyguard tetap bisa membunuhnya. ";
  return text;
};

module.exports = {
  getData,
  getInfo
};
