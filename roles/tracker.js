const getData = () => {
  const data = {
    name: "tracker",
    description: "Kamu adalah warga yang bisa melacak Targetmu kemana saja saat malam. ",
    skillText: "Tracker, pilih siapa yang mau kamu lacak",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "👣"
    },
    type: "Town Investigate",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/footprints_1f463.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Warga yang bisa melacak suatu pemain untuk diketahui kemana aja Targetnya. ";
  return text;
};

module.exports = {
  getData,
  getInfo
};
