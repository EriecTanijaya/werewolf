const getData = () => {
  const data = {
    name: "executioner",
    description: "Kamu adalah pendendam mengerikan dan kamu menang jika targetmu itu mati dihukum oleh warga",
    team: "executioner",
    canKill: false,
    emoji: {
      team: "🪓",
      self: "🪓"
    },
    type: "Neutral Chaos",
    targetLynchIndex: -1,
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/axe_1fa93.png"
  };
  return data;
};

const getInfo = () => {
  const info = {
    summary:
      "Algojo yang sangat terobsesi untuk menghukum seorang target dengan cara apapun. Executioner kebal dari serangan biasa dan akan menjadi Jester jika targetnya terbunuh saat malam hari.",
    goal: "Menghukum target dengan segala cara."
  };
  return info;
};

module.exports = { getData, getInfo };
