const getData = () => {
  const data = {
    name: "survivor",
    description:
      "Kamu bisa berpihak dengan siapa saja, asalkan kamu tidak mati. Jika kamu hidup hingga akhir game, kamu menang",
    skillText: "Survivor, apakah kamu akan gunakan vest malam ini?",
    cmdText: "/vest",
    team: "survivor",
    canKill: false,
    emoji: {
      team: "🏳️",
      self: "🏳️"
    },
    vest: 4,
    type: "Neutral",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/white-flag_1f3f3.png"
  };
  return data;
};

const getInfo = () => {
  const info = {
    summary:
      "Hanyalah orang yang ingin tetap hidup. Survivor dibekali 4 vest untuk melindungi diri sendiri dari serangan biasa.",
    goal: "Tetap hidup hingga akhir game"
  };
  return info;
};

module.exports = { getData, getInfo };
