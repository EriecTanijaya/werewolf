const getData = () => {
  const data = {
    name: "psychic",
    description: "Warga yang bisa menerima penglihatan setiap malam. Pas pagi cek dengan '/news' di pc bot",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "🔮"
    },
    type: "Town Investigate",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/crystal-ball_1f52e.png"
  };
  return data;
};

const getInfo = () => {
  const info = {
    summary:
      "Warga yang diberi kekuatan untuk menerima penglihatan mengenai siapa orang yang jahat dan baik setiap malam.",
    goal: "Menghukum semua kriminal dan penjahat"
  };
  return info;
};

module.exports = { getData, getInfo };
