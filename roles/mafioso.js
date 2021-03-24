const getData = () => {
  const data = {
    name: "mafioso",
    description: "Kamu dipihak Mafia, dan kamu suruhan Godfather untuk membunuh orang lain. ",
    skillText: "Mafioso, pilih siapa yang ingin di bunuh",
    team: "mafia",
    cmdText: "/skill",
    canKill: true,
    emoji: {
      team: "🤵",
      self: "🔫"
    },
    type: "Mafia Killing",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/pistol_1f52b.png"
  };
  return data;
};

const getInfo = () => {
  const info = {
    summary:
      "Anggota Mafia yang bertugas untuk membunuh target yang telah ditentukan oleh Godfather. Mafioso akan diangkat menjadi Godfather jika Godfather sebelumnya telah mati.",
    goal: "Menyingkirkan semua warga yang menentang Mafia"
  };
  return info;
};

module.exports = { getData, getInfo };
