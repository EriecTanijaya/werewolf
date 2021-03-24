const getData = () => {
  const data = {
    name: "amnesiac",
    description:
      "Kamu adalah orang yang lupa dengan role mu sendiri. Untuk mengingat role, bisa dengan pilih dari salah orang yang telah mati",
    skillText: "Amnesiac, pilih siapa yang mau kamu ingat rolenya",
    cmdText: "/skill",
    team: "amnesiac",
    canKill: false,
    emoji: {
      team: "🤕",
      self: "🤕"
    },
    type: "Neutral",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/face-with-head-bandage_1f915.png"
  };
  return data;
};

const getInfo = () => {
  const info = {
    summary:
      "Orang yang lupa dengan siapa dirinya. Dia dapat mengingat siapa dirinya dengan memilih salah satu dari orang yang telah mati. Jika Amnesiac telah mengingat apa rolenya, maka semua warga akan mengetahui apa role yang telah diingat oleh Amnesiac.",
    goal: "Mengingat salah satu role yang telah mati, lalu jalani goal role tersebut"
  };
  return info;
};

module.exports = { getData, getInfo };
