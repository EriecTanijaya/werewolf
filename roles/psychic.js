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
  let text = "Warga yang setiap malam bisa dapat penglihatan. ";
  text += "Pada bulan purnama ia dapat penglihatan 2 orang dan salah satu nya adalah orang baik. ";
  text += "Jika tidak bulan purnama, ia dapat penglihatan 3 orang dan salah satunya adalah orang jahat. ";
  text += "Orang baik adalah sesama warga, Survivor, Amnesiac dan Guardian Angel";
  return text;
};

module.exports = {
  getData,
  getInfo
};
