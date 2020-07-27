const getData = () => {
  const data = {
    name: "sheriff",
    description: "Kamu adalah warga yang bisa cek suatu warga mencurigakan atau tidak. ",
    skillText: "Sheriff, pilih siapa yang mau kamu cek",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "👮"
    },
    type: "Town Investigate",
    iconUrl: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/police-officer_1f46e.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Warga yang bisa cek suatu pemain mencurigakan atau tidak. ";
  text +=
    "Setiap warga akan tampil tidak mencurigakan. Namun role Godfather, Arsonist, Vampire, Executioner akan tampil tidak mencurigakan juga. ";
  text += "Jika target Sheriff di frame, maka akan tampil mencurigakan walaupun tidak. ";
  text +=
    "Namun jika Disguiser di cek Sheriff, maka akan tampil mencurigakan. Walaupun role imitasi Disguiser adalah warga. ";
  return text;
};

module.exports = {
  getData,
  getInfo
};
