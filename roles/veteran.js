const getData = () => {
  const data = {
    name: "veteran",
    description:
      "Kamu adalah warga yang memiliki paranoia, jika kamu 'alert', maka kamu akan membunuh siapa saja yang kerumahmu. ",
    skillText: "Veteran, apakah kamu akan alert malam ini?",
    cmdText: "/alert",
    team: "villager",
    canKill: true,
    emoji: {
      team: "👨‍🌾",
      self: "🎖️"
    },
    alert: 3,
    type: "Town Killing",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/military-medal_1f396.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Warga yang merupakan Veteran perang yang paranoia. ";
  text +=
    "Mudah terkejut sehingga jika dalam keadaan 'alert', bisa membunuh siapa saja yang kerumahnya. ";
  text += "Veteran immune dari role block Escort atau Consort. ";
  return text;
};

module.exports = {
  getData,
  getInfo
};
