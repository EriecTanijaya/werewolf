const getData = () => {
  const data = {
    name: "villager",
    description: "Kamu adalah warga (luar)biasa, tugasmu itu menggantung penjahat. Dan tolong, jangan micin",
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
  const info = {
    summary: "Warga biasa yang dapat mengetahui sesamanya dengan petunjuk berupa kata spesifik.",
    goal: "Menghukum semua kriminal dan penjahat"
  };
  return info;
};

module.exports = { getData, getInfo };
