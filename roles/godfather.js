const getData = () => {
  const data = {
    name: "godfather",
    description: "Kamu adalah ketua Mafia. Kamu kebal dari serangan biasa dan tidak bersalah jika di cek Sheriff",
    skillText: "Godfather, pilih siapa yang ingin dibunuh",
    cmdText: "/skill",
    team: "mafia",
    canKill: true,
    emoji: {
      team: "🤵",
      self: "🚬"
    },
    type: "Mafia Killing",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/cigarette_1f6ac.png"
  };
  return data;
};

const getInfo = () => {
  const info = {
    summary:
      "Kepala dari organisasi kriminal. Dapat memilih siapa yang akan dibunuh pada malam hari, dimana pembunuhnya akan dilakukan oleh Mafioso jika ada. Godfather kebal dari serangan biasa pada malam hari, dan akan tampak tidak mencurigakan jika di cek Sheriff.",
    goal: "Menyingkirkan semua warga yang menentang Mafia"
  };
  return info;
};

module.exports = { getData, getInfo };
