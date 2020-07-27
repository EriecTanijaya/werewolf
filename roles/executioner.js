const getData = () => {
  const data = {
    name: "executioner",
    description: "Kamu adalah pendendam mengerikan dan kamu menang jika targetmu itu mati digantung oleh warga",
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
  let text = "Pendendam yang ingin targetnya mati di gantung. Jika targetnya mati di serang saat malam, ";
  text +=
    "maka dia akan menjadi Jester. Targetnya akan selalu di pihak warga dan dia bisa immune dari serangan biasa. ";
  return text;
};

module.exports = {
  getData,
  getInfo
};
