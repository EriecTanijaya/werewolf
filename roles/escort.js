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
  const info = {
    summary:
      "Warga good-looking yang dapat mengganggu fokus dari seorang target. Sehingga dapat block skill dari seorang target.",
    goal: "Menghukum semua kriminal dan penjahat"
  };
  return info;
};

module.exports = { getData, getInfo };
