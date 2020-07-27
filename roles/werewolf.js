const getData = () => {
  const data = {
    name: "werewolf",
    description:
      "Kamu adalah Werewolf yang hanya berubah pada Full Moon, jika tidak berubah, kamu hanya seperti warga biasa",
    skillText: "Werewolf, pilih siapa yang ingin dibunuh",
    cmdText: "/skill",
    team: "werewolf",
    canKill: true,
    emoji: {
      team: "🐺",
      self: "🐺"
    },
    type: "Neutral Killing",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/wolf_1f43a.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Warga biasa yang bisa berubah menjadi Werewolf pada bulan purnama. ";
  text += "Bisa RAMPAGE pada rumah target. Yang ke rumah target Werewolf akan diserang juga. ";
  text += "Werewolf akan tampil tidak bersalah jika di cek pada saat tidak bulan purnama. ";
  text += "Werewolf immune dari role block dan serangan biasa pada bulan purnama";
  return text;
};

module.exports = {
  getData,
  getInfo
};
