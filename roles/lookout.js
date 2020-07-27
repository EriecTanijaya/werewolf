const getData = () => {
  const data = {
    name: "lookout",
    description:
      "Kamu adalah warga yang bisa memantau rumah seseorang pas malam, sehingga bisa mengetahui siapa pendatangnya",
    skillText: "Lookout, pilih rumah yang ingin dipantau",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "👀"
    },
    type: "Town Investigate",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/eyes_1f440.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Warga yang bisa memilih rumah siapa yang ingin dipantau pas malam. ";
  text += "Lookout bisa mengetahui siapa saja pendatang rumah dari target yang dipantau. ";
  return text;
};

module.exports = {
  getData,
  getInfo
};
