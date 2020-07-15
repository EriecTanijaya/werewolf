const getData = () => {
  const data = {
    name: "villager",
    description:
      "Kamu adalah warga (luar)biasa, tugasmu itu menggantung penjahat",
    team: "villager",
    canKill: false,
    emoji: {
      team: "👨‍🌾",
      self: "👨‍🌾"
    },
    type: "Town",
    iconUrl:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/241/man-farmer_1f468-200d-1f33e.png"
  };
  return data;
};

const getInfo = () => {
  let text = "Villager atau Town, adalah kelompok warga yang memiliki misi ";
  text += "untuk menghukum orang yang membawa malapetaka di Kota Bedburg. ";
  return text;
};

module.exports = {
  getData,
  getInfo
};
