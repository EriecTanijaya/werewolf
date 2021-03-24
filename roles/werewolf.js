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
  const info = {
    summary: "Warga biasa yang dapat berubah menjadi Manusia Serigala saat bulan purnama. ",
    goal: "Membunuh semua orang yang menentangmu"
  };
  return info;
};

module.exports = { getData, getInfo };
